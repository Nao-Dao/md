import { defineStore } from 'pinia'
import { marked } from 'marked'
import CodeMirror from 'codemirror/lib/codemirror'

import config from '../assets/scripts/config'
import WxRenderer from '../assets/scripts/renderers/wx-renderer'
import DEFAULT_CONTENT from '@/assets/example/markdown.md'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt'
import { setColor, formatDoc, formatCss } from '@/assets/scripts/util'

export const useStore = defineStore(`store`, {
  state: () => ({
    wxRenderer: null,
    output: ``,
    html: ``,
    editor: null,
    cssEditor: null,
    currentFont: ``,
    currentSize: ``,
    currentColor: ``,
    citeStatus: false,
    nightMode: false,
    codeTheme: config.codeThemeOption[2].value,
    isMacCodeBlock: true,
  }),
  actions: {
    setEditorValue(data) {
      this.editor.setValue(data)
    },
    setCssEditorValue(data) {
      this.cssEditor.setValue(data)
    },
    setWxRendererOptions(data) {
      this.wxRenderer.setOptions(data)
    },
    setCiteStatus(data) {
      this.citeStatus = data
      localStorage.setItem(`citeStatus`, data)
    },
    setCurrentFont(data) {
      this.currentFont = data
      localStorage.setItem(`fonts`, data)
    },
    setCurrentSize(data) {
      this.currentSize = data
      localStorage.setItem(`size`, data)
    },
    setCurrentColor(data) {
      this.currentColor = data
      localStorage.setItem(`color`, data)
    },
    setCurrentCodeTheme(data) {
      this.codeTheme = data
      localStorage.setItem(`codeTheme`, data)
    },
    setIsMacCodeBlock(data) {
      this.isMacCodeBlock = data
      localStorage.setItem(`isMacCodeBlock`, data)
    },
    themeChanged() {
      this.nightMode = !this.nightMode
      localStorage.setItem(`nightMode`, this.nightMode)
    },
    initEditorState() {
      this.currentFont =
        localStorage.getItem(`fonts`) || config.builtinFonts[0].value
      this.currentColor =
        localStorage.getItem(`color`) || config.colorOption[0].value
      this.currentSize =
        localStorage.getItem(`size`) || config.sizeOption[2].value
      this.codeTheme =
        localStorage.getItem(`codeTheme`) || config.codeThemeOption[2].value
      this.citeStatus = localStorage.getItem(`citeStatus`) === `true`
      this.nightMode = localStorage.getItem(`nightMode`) === `true`
      this.isMacCodeBlock = !(
        localStorage.getItem(`isMacCodeBlock`) === `false`
      )
      this.wxRenderer = new WxRenderer({
        theme: setColor(this.currentColor),
        fonts: this.currentFont,
        size: this.currentSize,
      })
    },
    initEditorEntity() {
      const editorDom = document.getElementById(`editor`)

      if (!editorDom.value) {
        editorDom.value =
          localStorage.getItem(`__editor_content`) || formatDoc(DEFAULT_CONTENT)
      }
      this.editor = CodeMirror.fromTextArea(editorDom, {
        mode: `text/x-markdown`,
        theme: `xq-light`,
        lineNumbers: false,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        extraKeys: {
          'Ctrl-F': function autoFormat(editor) {
            const doc = formatDoc(editor.getValue(0))
            localStorage.setItem(`__editor_content`, doc)
            editor.setValue(doc)
          },
          'Ctrl-S': function save(editor) {},
          'Ctrl-B': function bold(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`**${selected}**`)
          },
          'Ctrl-D': function del(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`~~${selected}~~`)
          },
          'Ctrl-I': function italic(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`*${selected}*`)
          },
        },
      })
    },
    initCssEditorEntity() {
      const cssEditorDom = document.getElementById(`cssEditor`)

      if (!cssEditorDom.value) {
        cssEditorDom.value =
          localStorage.getItem(`__css_content`) || DEFAULT_CSS_CONTENT
      }
      this.cssEditor = CodeMirror.fromTextArea(cssEditorDom, {
        mode: `css`,
        theme: `style-mirror`,
        lineNumbers: false,
        lineWrapping: true,
        matchBrackets: true,
        autofocus: true,
        extraKeys: {
          'Ctrl-F': function autoFormat(editor) {
            const doc = formatCss(editor.getValue(0))
            localStorage.setItem(`__css_content`, doc)
            editor.setValue(doc)
          },
          'Ctrl-S': function save(editor) {},
        },
      })
    },

    editorRefresh() {
      marked.use({
        extensions: [
          {
            name: `small_img`,
            level: `inline`,
            start(src) {
              return src.match(/^!s\[(.*?)\]\(.*?\)$/)?.index
            },
            tokenizer(src) {
              const rule = /^!s\[(.*?)\]\((.*?)\)$/
              const match = rule.exec(src)
              if (match) {
                return {
                  type: `small_img`,
                  raw: match[0],
                  text: match[1],
                  href: match[2],
                }
              }
              return null
            },
            renderer(token) {
              const { text, href } = token
              return `<section style="margin: 1.5em 8px; text-align: center;">
                <section style="width: 50%; margin: 0 auto;">
                  <img style="width: 100% !important;" src="${href}" title="${text}" alt="${text}" />
                </section></section>`
            },
          },
          {
            name: `y_highlight`,
            level: `inline`,
            start(src) {
              return src.match(/^y\[(.*?)\]/)?.index
            },
            tokenizer(src) {
              const rule = /^y\[(.*?)\]/
              const match = rule.exec(src)
              if (match) {
                const data = match[1]
                  .split(`\n`)
                  .map((v) => this.lexer.inlineTokens(v))
                return {
                  type: `y_highlight`,
                  raw: match[0],
                  text: match[1],
                  data: data,
                }
              }
              return null
            },
            renderer(token) {
              const { text, data } = token
              return `<section style="font-size: 16px;
              color: rgb(255, 169, 0);
              font-weight: 700;
              line-height: 46px;
              text-align: center;">${text}</section>`
            },
          },
          {
            name: `g_highlight`,
            level: `inline`,
            start(src) {
              return src.match(/^g\[(.*?)\]/)?.index
            },
            tokenizer(src) {
              const rule = /^g\[(.*?)\]/
              const match = rule.exec(src)
              if (match) {
                const data = match[1]
                  .split(`\n`)
                  .map((v) => this.lexer.inlineTokens(v))
                return {
                  type: `g_highlight`,
                  raw: match[0],
                  text: match[1],
                  data: data,
                }
              }
              return null
            },
            renderer(token) {
              const { text, data } = token
              return `<section style="font-size: 16px;
              color: rgb(24, 129, 87);
              font-weight: 700;
              line-height: 46px;
              word-wrap: wrap;
              text-align: center;">${text}</section>`
            },
          },
          {
            name: `c_no_render`,
            level: `inline`,
            start(src) {
              return src.match(/^c\[(.*?)\]/)?.index
            },
            tokenizer(src) {
              const rule = /^c\[(.*?)\]/
              const match = rule.exec(src)
              if (match) {
                const data = match[1]
                  .split(`\n`)
                  .map((v) => this.lexer.inlineTokens(v))
                return {
                  type: `c_no_render`,
                  raw: match[0],
                  text: match[1],
                  data: data,
                }
              }
              return null
            },
            renderer(token) {
              const { text, data } = token
              return `${text}`
            },
          },
          {
            name: `box`,
            level: `block`,
            start(src) {
              return src.match(/^<<<((?:.|\n)*?)>>>(?:\n|$)/)?.index
            },
            tokenizer(src) {
              const rule = /^<<<((?:.|\n)*?)>>>(?:\n|$)/
              const match = rule.exec(src)
              if (match) {
                const data = match[1]
                  .split(`\n`)
                  .map((v) => this.lexer.inlineTokens(v))
                return {
                  type: `box`,
                  raw: match[0],
                  text: match[1],
                  data: data,
                }
              }
              return null
            },
            renderer(token) {
              const { text, data } = token
              let a = ``
              data.forEach((v, i) => {
                if (v == ``) {
                  a += `<section>&nbsp;</section>`
                } else {
                  a += `<section>${this.parser.parseInline(v)}</section>`
                }
              })
              return `<section style="
              font-family: Calibri;
              border-radius: 9px;
              text-align: left;
              background-image: linear-gradient(90deg, rgb(24, 129, 87), rgb(219, 249, 246));
              padding: 2px;
              line-height: 2em;
          "><section style="background-color: white; border-radius: 8px; padding: 15px;">${a}</section></section>`
            },
          },
          {
            name: `cite`,
            level: `inline`,
            start(src) {
              return src.match(/^&\[(.*?)\]\((.*?)\)/)?.index
            },
            tokenizer(src) {
              const rule = /^&\[(.*?)\]\((.*?)\)(?:\n|$)/
              const match = rule.exec(src)
              if (match) {
                return {
                  type: `cite`,
                  raw: match[0],
                  title: this.lexer.inlineTokens(match[1].trim()),
                  link: match[2],
                }
              }
              return null
            },
            renderer(token) {
              const { title, link } = token
              return `<section style="word-break: break-word; line-height: 1.6;">
              <a href="${link}" target="_blank" style="position:relative; display:flex; box-sizing:border-box; flex-direction:row; -webkit-box-align:center; align-items:center; width:390px; min-height:84px; border-radius:8px; max-width:100%; overflow:hidden; margin:16px auto; padding:12px 12px 9px 12px; background-color:#F6F6F6; text-decoration: none;">
                  <span style="display: block; flex: 1 1 auto; position: relative; -webkit-box-flex: 1;">
                      <span class="two-line" style="display: -webkit-box; font-size: 15px; font-weight: 500; line-height: 1.4; margin-bottom: 2px; color: #121212; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 1; line-height: 20px; -webkit-line-clamp: 2;">
                          ${this.parser.parseInline(title)}
                      </span>
                      <span style="display: -webkit-box; font-size: 13px; height: 18px; line-height: 18px; color: #999999; word-break: break-all; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">
                          <span style="display: inline-flex; align-items: center;">
                              &ZeroWidthSpace;
                              <svg width="14" height="14" viewBox="0 0 24 24" class="Zi Zi--InsertLink" fill="currentColor">
                                  <path fill-rule="evenodd"
                                      d="M5.327 18.883a3.005 3.005 0 0 1 0-4.25l2.608-2.607a.75.75 0 1 0-1.06-1.06l-2.608 2.607a4.505 4.505 0 0 0 6.37 6.37l2.608-2.607a.75.75 0 0 0-1.06-1.06l-2.608 2.607a3.005 3.005 0 0 1-4.25 0Zm5.428-11.799a.75.75 0 0 0 1.06 1.06L14.48 5.48a3.005 3.005 0 0 1 4.25 4.25l-2.665 2.665a.75.75 0 0 0 1.061 1.06l2.665-2.664a4.505 4.505 0 0 0-6.371-6.372l-2.665 2.665Zm5.323 2.117a.75.75 0 1 0-1.06-1.06l-7.072 7.07a.75.75 0 0 0 1.061 1.06l7.071-7.07Z"
                                      clip-rule="evenodd"></path>
                              </svg>
                          </span>${link}
                      </span>
                  </span>
              </a>
          </section>`
            },
          },
        ],
      })
      const renderer = this.wxRenderer.getRenderer(this.citeStatus)
      marked.setOptions({ renderer })
      let output = marked.parse(this.editor.getValue(0))

      // 去除第一行的 margin-top
      output = output.replace(/(style=".*?)"/, `$1;margin-top: 0"`)
      if (this.citeStatus) {
        // 引用脚注
        output += this.wxRenderer.buildFootnotes()
        // 附加的一些 style
        output += this.wxRenderer.buildAddition()
      }

      if (this.isMacCodeBlock) {
        output += `
          <style>
            .hljs.code__pre::before {
              position: initial;
              padding: initial;
              content: '';
              display: block;
              height: 25px;
              background-color: transparent;
              background-image: url("https://doocs.oss-cn-shenzhen.aliyuncs.com/img/123.svg");
              background-position: 14px 10px;
              background-repeat: no-repeat;
              background-size: 40px;
            }

            .hljs.code__pre {
              padding: 0!important;
            }

            .hljs.code__pre code {
              display: -webkit-box;
              padding: 0.5em 1em 1em;
              overflow-x: auto;
              text-indent: 0;
            }
          </style>
        `
      }
      this.output = output
    },
  },
})
