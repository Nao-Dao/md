import Vue from 'vue'
import Vuex from 'vuex'
import config from '../assets/scripts/config'
import WxRenderer from '../assets/scripts/renderers/wx-renderer'
import { marked } from 'marked'
import CodeMirror from 'codemirror/lib/codemirror'
import DEFAULT_CONTENT from '@/assets/example/markdown.md'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt'
import { setColor, formatDoc, formatCss } from '@/assets/scripts/util'

Vue.use(Vuex)

const state = {
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
}
const mutations = {
  setEditorValue(state, data) {
    state.editor.setValue(data)
  },
  setCssEditorValue(state, data) {
    state.cssEditor.setValue(data)
  },
  setWxRendererOptions(state, data) {
    state.wxRenderer.setOptions(data)
  },
  setCiteStatus(state, data) {
    state.citeStatus = data
    localStorage.setItem(`citeStatus`, data)
  },
  setCurrentFont(state, data) {
    state.currentFont = data
    localStorage.setItem(`fonts`, data)
  },
  setCurrentSize(state, data) {
    state.currentSize = data
    localStorage.setItem(`size`, data)
  },
  setCurrentColor(state, data) {
    state.currentColor = data
    localStorage.setItem(`color`, data)
  },
  setCurrentCodeTheme(state, data) {
    state.codeTheme = data
    localStorage.setItem(`codeTheme`, data)
  },
  setIsMacCodeBlock(state, data) {
    state.isMacCodeBlock = data
    localStorage.setItem(`isMacCodeBlock`, data)
  },
  themeChanged(state) {
    state.nightMode = !state.nightMode
    localStorage.setItem(`nightMode`, state.nightMode)
  },
  initEditorState(state) {
    state.currentFont =
      localStorage.getItem(`fonts`) || config.builtinFonts[0].value
    state.currentColor =
      localStorage.getItem(`color`) || config.colorOption[0].value
    state.currentSize =
      localStorage.getItem(`size`) || config.sizeOption[2].value
    state.codeTheme =
      localStorage.getItem(`codeTheme`) || config.codeThemeOption[2].value
    state.citeStatus = localStorage.getItem(`citeStatus`) === `true`
    state.nightMode = localStorage.getItem(`nightMode`) === `true`
    state.isMacCodeBlock = !(localStorage.getItem(`isMacCodeBlock`) === `false`)
    state.wxRenderer = new WxRenderer({
      theme: setColor(state.currentColor),
      fonts: state.currentFont,
      size: state.currentSize,
    })
  },
  initEditorEntity(state) {
    const editorDom = document.getElementById(`editor`)

    if (!editorDom.value) {
      editorDom.value =
        localStorage.getItem(`__editor_content`) || formatDoc(DEFAULT_CONTENT)
    }
    state.editor = CodeMirror.fromTextArea(editorDom, {
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
  initCssEditorEntity(state) {
    const cssEditorDom = document.getElementById(`cssEditor`)

    if (!cssEditorDom.value) {
      cssEditorDom.value =
        localStorage.getItem(`__css_content`) || DEFAULT_CSS_CONTENT
    }
    state.cssEditor = CodeMirror.fromTextArea(cssEditorDom, {
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
  editorRefresh(state) {
    marked.use({
      extensions: [
        {
          name: `cite`,
          level: `block`,
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
                title: match[1],
                link: match[2],
              }
            }
            return null
          },
          renderer(token) {
            const { title, link } = token
            return `<div style="word-break: break-word; line-height: 1.6;">
            <a href="${link}" target="_blank" style="position:relative; display:flex; box-sizing:border-box; flex-direction:row; -webkit-box-align:center; align-items:center; width:390px; min-height:84px; border-radius:8px; max-width:100%; overflow:hidden; margin:16px auto; padding:12px 12px 9px 12px; background-color:#F6F6F6; text-decoration: none;">
                <span style="display: block; flex: 1 1 auto; position: relative; -webkit-box-flex: 1;">
                    <span class="two-line" style="display: -webkit-box; font-size: 15px; font-weight: 500; line-height: 1.4; margin-bottom: 2px; color: #121212; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 1; line-height: 20px; -webkit-line-clamp: 2;">
                        ${title}
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
        </div>`
          },
        },
      ],
    })
    const renderer = state.wxRenderer.getRenderer(state.citeStatus)
    marked.setOptions({ renderer })
    let output = marked.parse(state.editor.getValue(0))

    // 去除第一行的 margin-top
    output = output.replace(/(style=".*?)"/, `$1;margin-top: 0"`)
    if (state.citeStatus) {
      // 引用脚注
      output += state.wxRenderer.buildFootnotes()
      // 附加的一些 style
      output += state.wxRenderer.buildAddition()
    }

    if (state.isMacCodeBlock) {
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
          }
        </style>
      `
    }
    state.output = output
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions: {},
})
