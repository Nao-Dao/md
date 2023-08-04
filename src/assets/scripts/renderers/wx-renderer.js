import { Renderer } from "marked";
import hljs from 'highlight.js';

class WxRenderer {
  constructor(opts) {
    this.opts = opts;
    let footnotes = [];
    let footnoteIndex = 0;
    let styleMapping = new Map();

    let merge = (base, extend) => Object.assign({}, base, extend);

    this.buildTheme = (themeTpl) => {
      let mapping = {};
      let base = merge(themeTpl.BASE, {
        "font-family": this.opts.fonts,
        "font-size": this.opts.size,
      });
      for (let ele in themeTpl.inline) {
        if (themeTpl.inline.hasOwnProperty(ele)) {
          let style = themeTpl.inline[ele];
          mapping[ele] = merge(themeTpl.BASE, style);
        }
      }

      let base_block = merge(base,  {});
      for (let ele in themeTpl.block) {
        if (themeTpl.block.hasOwnProperty(ele)) {
          let style = themeTpl.block[ele];
          mapping[ele] = merge(base_block, style);
        }
      }
      return mapping;
    };

    let getStyles = (tokenName, addition) => {
      let arr = [];
      let dict = styleMapping[tokenName];
      if (!dict) return "";
      for (const key in dict) {
        arr.push(key + ":" + dict[key]);
      }
      return `style="${arr.join(";") + (addition || "")}"`;
    };

    let addFootnote = (title, link) => {
      // check
      let rep = false;
      footnotes.forEach((v) => {
        if (v[1] == title && v[2] == link) rep = true;
      });
      if (!rep) footnotes.push([++footnoteIndex, title, link]);
      console.log(footnotes);
      return footnoteIndex;
    };

    this.buildFootnotes = () => {
      let footnoteArray = footnotes.map((x) => {
        if (x[1] === x[2]) {
          return `<code style="font-size: 90%; opacity: 0.6;">[${x[0]}]</code>: <i>${x[1]}</i><br/>`;
        }
        return `<code style="font-size: 90%; opacity: 0.6;">[${x[0]}]</code> ${x[1]}: <i>${x[2]}</i><br/>`;
      });
      if (!footnoteArray.length) {
        return "";
      }
      return `<h4 ${getStyles("h4")}>引用链接</h4><p ${getStyles(
        "footnotes"
      )}>${footnoteArray.join("\n")}</p>`;
    };

    this.buildAddition = () => {
      return `
            <style>
            .preview-wrapper pre::before {
                position: absolute;
                top: 0;
                right: 0;
                color: #ccc;
                text-align: center;
                font-size: 0.8em;
                padding: 5px 10px 0;
                line-height: 15px;
                height: 15px;
                font-weight: 600;
            }
            </style>
        `;
    };

    this.setOptions = (newOpts) => {
      this.opts = merge(this.opts, newOpts);
    };

    this.hasFootnotes = () => footnotes.length !== 0;

    this.getRenderer = (status) => {
      footnotes = [];
      footnoteIndex = 0;
      let storeH1 = 0,
          storeH2 = 0,
          storeH3 = 0,
          storeH4 = 0;
      const autoId = false;

      styleMapping = this.buildTheme(this.opts.theme);
      let renderer = new Renderer();

      renderer.heading = (text, level) => {
        switch (level) {
          case 1:
            storeH1 += 1;
            storeH2 = 0;
            return `<h1 ${getStyles("h1")}><section style="
              width: 19px;
              height: 10px;
              margin: 0 0 0 4px;">
            <img src="http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/02/1690939678433-8110c1d8-812f-4570-b9fc-175e8342bda4.png" style="
              width: 100%;" />
            </section><section style="background: rgb(237, 249, 235); padding: 11px 20px 13px 26px;">
              ${autoId == true ? storeH1.toString().padStart(2, `0`) : ""}${text}
            </section></h1>`;
          case 2:
            storeH2 += 1;
            storeH3 = 0;
            return `<h2 ${getStyles("h2")}>${autoId != true ? storeH2.toString() : ""}. ${text}</h2>`;
          case 3:
            storeH3 += 1;
            storeH4 = 0;
            return `<h3 ${getStyles("h3")}>${autoId == true ? storeH3.toString().padStart(2, `0`) : ""}${text}</h3>`;
          default:
            storeH4 += 1;
            return `<h4 ${getStyles("h4")}>${autoId == true ? storeH4.toString().padStart(2, `0`) : ""}${text}</h4>`;
        }
      };
      renderer.paragraph = (text) => {
        if (text.indexOf("<figure") != -1 && text.indexOf("<img") != -1) {
          return text;
        }
        return text.replace(/ /g, "") === ""
          ? ""
          : `<p ${getStyles("p")}>${text}</p>`;
      };

      renderer.blockquote = (text) => {
        text = text.replace(/<p.*?>/g, `<p ${getStyles("blockquote_p")}>`);
        return `<blockquote ${getStyles("blockquote")}>${text}</blockquote>`;
      };
      renderer.code = (text, lang) => {
        lang = hljs.getLanguage(lang) ? lang : 'plaintext';

        text = hljs.highlight(text, {language: lang}).value;

        text = text.replace(/\r\n/g,"<br/>")
                   .replace(/\n/g,"<br/>")
                   .replace(/(>[^<]+)|(^[^<]+)/g, function(str) {
                     return str.replace(/\s/g, '&nbsp;')
                   });

        return `<pre class="hljs code__pre" ${getStyles("code_pre")}><code class="prettyprint language-${lang}" ${getStyles("code")}>${text}</code></pre>`
      };
      renderer.codespan = (text, lang) =>
        `<code ${getStyles("codespan")}>${text}</code>`;
      renderer.listitem = (text) =>
        `<li ${getStyles(
          "listitem"
        )}><%s/><span style='vertical-align: middle;'>${text}</span></li>`;

      renderer.list = (text, ordered, start) => {
        text = text.replace(/<\/*p .*?>/g, "").replace(/<\/*p>/g, "");
        let segments = text.split(`<%s/>`);
        if (!ordered) {
          text = segments.join("<span style='font-size: 20px; vertical-align: middle; color: rgb(24, 129, 87);'>※ </span>");
          return `<ul ${getStyles("ul")}>${text}</ul>`;
        }
        text = segments[0];
        for (let i = 1; i < segments.length; i++) {
          text = text + i + ". " + segments[i];
        }
        return `<ol ${getStyles("ol")}>${text}</ol>`;
      };
      renderer.image = (href, title, text) => {
        let subText = "";
        if (text) {
          subText = `<figcaption ${getStyles(
            "figcaption"
          )}>${text}</figcaption>`;
        }
        let figureStyles = getStyles("figure");
        let imgStyles = getStyles("image");
        return `<figure ${figureStyles}><img ${imgStyles} src="${href}" title="${title}" alt="${text}"/>${subText}</figure>`;
      };
      renderer.link = (href, title, text) => {
        if (href.startsWith("https://mp.weixin.qq.com")) {
          return `<a href="${href}" title="${title || text}" ${getStyles(
            "wx_link"
          )}>${text}</a>`;
        }
        if (href === text) {
          return text;
        }
        if (status) {
          let ref = addFootnote(title || text, href);
          return `<span ${getStyles("link")}>${text}<sup>[${ref}]</sup></span>`;
        }
        return `<span ${getStyles("link")}>${text}</span>`;
      };
      renderer.strong = (text) =>
        `<strong ${getStyles("strong")}>${text}</strong>`;
      renderer.em = (text) =>
        `<span style="font-style: italic;">${text}</span>`;
      renderer.table = (header, body) =>
        `<section style="padding:0 8px;"><table class="preview-table"><thead ${getStyles(
          "thead"
        )}>${header}</thead><tbody>${body}</tbody></table></section>`;
      renderer.tablecell = (text, flags) =>
        `<td ${getStyles("td")}>${text}</td>`;
      renderer.hr = () => `<hr ${getStyles("hr")}>`;
      return renderer;
    };
  }
}
export default WxRenderer;
