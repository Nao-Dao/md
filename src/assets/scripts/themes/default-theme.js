let baseColor = `#3f3f3f`

export default {
  BASE: {
    'text-align': `left`,
    'line-height': `1.75`,
  },
  block: {
    // 一级标题样式
    h1: {
      'font-size': `20px`,
      'text-align': `center`,
      'font-weight': `bold`,
      display: `table`,
      margin: `2em auto 1em`,
      color: `rgb(24, 129, 87)`,
      'line-height': `22px`,
      'letter-spacing': `1px`,
      'word-break': `normal !important`,
      border: `none`,
      'border-bottom': `none`,
      position: `relative`,
    },

    // 二级标题样式
    h2: {
      'font-size': `18px`,
      'text-align': `left`,
      'font-weight': `bold`,
      display: `table`,
      margin: `24px 16px 8px 0`,
      color: `rgb(24, 129, 87)`,
      'font-family': `Inter-SemiBold`,
    },

    // 三级标题样式
    h3: {
      'font-weight': `bold`,
      'font-size': `1.1em`,
      margin: `2em 8px 0.75em 0`,
      'line-height': `1.2`,
      'padding-left': `8px`,
      'border-left': `3px solid rgba(0, 152, 116, 0.9)`,
      color: baseColor,
    },

    // 四级标题样式
    h4: {
      'font-weight': `bold`,
      'font-size': `1em`,
      margin: `2em 8px 0.5em`,
      color: `rgba(66, 185, 131, 0.9)`,
    },

    // 段落样式
    p: {
      margin: `1.5em 8px`,
      'letter-spacing': `0.1em`,
      color: baseColor,
      'text-indent': `1em`,
    },

    // 引用样式
    blockquote: {
      'font-style': `normal`,
      'border-left': `none`,
      padding: `0px 1em`,
      'border-radius': `8px`,
      color: `rgba(0,0,0,0.5)`,
      background: `#f7f7f7`,
      margin: `0px 20px`,
      'text-indent': `1em`,
    },

    blockquote_p: {
      'letter-spacing': `0.1em`,
      color: `rgb(80, 80, 80)`,
      'font-size': `1em`,
      display: `block`,
    },
    code_pre: {
      'font-size': `14px`,
      'overflow-x': `auto`,
      'border-radius': `8px`,
      padding: `1em`,
      'line-height': `1.5`,
      margin: `10px 8px`,
    },
    code: {
      margin: 0,
      'white-space': `nowrap`,
      'font-family': `Menlo, Operator Mono, Consolas, Monaco, monospace`,
    },

    image: {
      'border-radius': `4px`,
      display: `block`,
      margin: `0.1em auto 0.5em`,
      width: `100% !important`,
    },

    ol: {
      'margin-left': `0`,
      'padding-left': `1em`,
      color: baseColor,
    },

    ul: {
      margin: `0 0 20px 10px`,
      'padding-left': `1em`,
      'list-style': `circle`,
      color: baseColor,
    },

    footnotes: {
      margin: `0.5em 8px`,
      'font-size': `80%`,
      color: baseColor,
    },

    figure: {
      margin: `1.5em 8px`,
      color: baseColor,
    },
    hr: {
      'border-style': `solid`,
      'border-width': `1px 0 0`,
      'border-color': `rgba(0,0,0,0.1)`,
      '-webkit-transform-origin': `0 0`,
      '-webkit-transform': `scale(1, 0.5)`,
      'transform-origin': `0 0`,
      transform: `scale(1, 0.5)`,
    },
  },
  inline: {
    listitem: {
      'text-indent': `-1em`,
      display: `block`,
      margin: `0.2em 8px`,
      color: baseColor,
    },

    codespan: {
      'font-size': `90%`,
      color: `#BE5123`,
      background: `rgba(27,31,35,.05)`,
      padding: `3px 5px`,
      'border-radius': `4px`,
      'word-break': `break-word`,
    },

    link: {
      color: `rgb(24, 129, 87)`,
    },

    wx_link: {
      color: `#576b95`,
      'text-decoration': `none`,
    },

    // 字体加粗样式
    strong: {
      'font-weight': `bold`,
      'font-family': `Optima-Regular, PingFangTC-light`,
      'letter-spacing': `2px`,
      'background-color': `rgb(24, 129, 87)`,
      color: `rgb(255, 255, 255)`,
      'box-sizing': `border-box !important`,
      'overflow-wrap': `break-word !important`,
      'word-break': `break-word`,
    },

    table: {
      'border-collapse': `collapse`,
      'text-align': `center`,
      margin: `1em 8px`,
      color: baseColor,
    },

    thead: {
      background: `rgba(0, 0, 0, 0.05)`,
      'font-weight': `bold`,
      color: baseColor,
    },

    td: {
      border: `1px solid #dfdfdf`,
      padding: `0.25em 0.5em`,
      color: baseColor,
    },

    footnote: {
      'font-size': `12px`,
      color: baseColor,
    },

    figcaption: {
      'text-align': `center`,
      color: `#888`,
      'font-size': `0.8em`,
    },
  },
}
