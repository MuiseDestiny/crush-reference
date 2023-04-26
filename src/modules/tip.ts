import { config } from "../../package.json";
import Utils from "./utils";

export default class TipUI {
  private utils: Utils;
  private refRect!: Rect;
  private position!: string;
  public container!: HTMLDivElement;
  public shadeMillisecond!: number;
  public removeTipAfterMillisecond!: number;
  private option = {
    size: 8,
    color: {
      active: "#FF597B",
      default: "#F9B5D0"
    }
  }
  public tipTimer!: number;

  constructor() {
    this.shadeMillisecond = parseInt(Zotero.Prefs.get(`${config.addonRef}.shadeMillisecond`) as string)
    this.removeTipAfterMillisecond = parseInt(Zotero.Prefs.get(`${config.addonRef}.removeTipAfterMillisecond`) as string)
    this.utils = new Utils()
  }

  public onInit(refRect: Rect, position:string) {
    this.refRect = refRect;
    this.position = position;
    // 初始化，先移除其它container
    this.clear()
    this.buildContainer()
  }

  public clear() {
    document.querySelectorAll(".zotero-reference-tip-container").forEach((e: any) => {
      e.style.opacity = "0"
      window.setTimeout(() => {
        e.remove()
      }, this.shadeMillisecond);
    })
  }
  /**
   * 放置container到合适位置
   * 
   */
  private place() {
    `
		winRect = {
			bottom: 792
			height: 792
			left: 0
			right: 1536
			top: 0
			width: 1536
			x: 0
			y: 0
		}
		eleRect = {
			bottom: 188
			height: 16
			left: 1196
			right: 1507
			top: 172
			width: 310
			x: 1196
			y: 172
		}
		右上(x=0, y=0)
		`
    let setStyles = (styles: {[key: string]: string}) => {
      for (let k in styles) {
        this.container.style[k as any] = styles[k]
      }
      return this.container.getBoundingClientRect() as Rect
    }
    const winRect: Rect = document.documentElement.getBoundingClientRect()
    const maxWidth = winRect.width;
    const maxHeight = winRect.height;
    const refRect = this.refRect;

    // 左侧
    let styles: any
    if (this.position == "left") {
      styles = {
        // right: `${maxWidth - refRect.x + maxWidth * .014}px`,
        right: `${maxWidth - refRect.x}px`,

        bottom: "",
        top: `${refRect.y}px`,
        width: `${refRect.x * .7}px`
      }
    } else if (this.position == "top center") {
      let width = maxWidth * .7
      styles = {
        width: `${width}px`,
        left: `${refRect.x + refRect.width / 2 - width / 2}px`,
        bottom: `${maxHeight - refRect.y}px`,
        top: "",
      }
      this.container.style.flexDirection = "column-reverse"
    }
    let rect = setStyles(styles)
    // 判断是否超届
    if (rect.bottom > maxHeight) {
      setStyles({
        top: "",
        bottom: "0px",
      })
      this.container.style.flexDirection = "column-reverse"
    }
    if (rect.top < 0) {
      setStyles({
        bottom: "",
        top: "0px",
      })
    }
    if (rect.left < 30) {
      setStyles({
        right: "",
        left: "30px"
      })
    }
    if (maxWidth - rect.right < 30 ) {
      setStyles({
        left: "",
        right: "30px"
      })
    }
    this.container.style.opacity = "1";
    return
  }

  private buildContainer() {
    // 位置计算
    this.container = ztoolkit.UI.createElement(
      document,
      "div",
      {
        namespace: "html",
        classList: ["zotero-reference-tip-container"],
        styles: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "fixed",
          zIndex: "999",
          // border: "2px solid transparent",
          padding: "1em",
          backgroundColor: Zotero.Prefs.get(`${config.addonRef}.tipBackgroundColor`) as string,
          opacity: "0",
          transition: `opacity ${this.shadeMillisecond / 1000}s linear`,
          "-moz-user-select": "text",
          boxShadow: "0 4px 24px rgb(0 0 0 / 20%)",
          borderRadius: "8px",

        } as any,
        listeners: [
          {
            type: "DOMMouseScroll",
            listener: (event: any) => {
              if (event.ctrlKey) { this.zoom(event); }
            }
          },
          {
            type: "mouseenter",
            listener: () => {
              window.clearTimeout(this.tipTimer);
            }
          },
          {
            type: "mouseleave",
            listener: () => {
              this.tipTimer = window.setTimeout(() => {
                this.container.remove();
              }, this.removeTipAfterMillisecond);
            }
          }
        ],
        children: [
          {
            tag: "box",
            id: "option-container",
            styles: {
              width: "100%",
              height: `${this.option.size}px`,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: ".25em",
              marginTop: ".25em"
            },
          },
          {
            tag: "box",
            id: "content-container",
            styles: {
              width: "100%"
            }
          }
        ]
      }
    ) as unknown as HTMLDivElement
    document.documentElement.appendChild(this.container)
  }

  /**
   * @param title 标题
   * @param tags 标签
   * @param descriptions 描述，一般是期刊，年份作者等
   * @param content 正文，一般是摘要
   * @returns 
   */
  public addTip(
    title: string,
    tags: { source: string; text: string, color: string, tip?: string, url?: string, item?: Zotero.Item }[],
    descriptions: string[],
    content: string,
    according: string,
    index: number,
    prefIndex?: number
  ) {
    const translate = async (text: string) => {
      if (Zotero.ZoteroPDFTranslate) {
        Zotero.ZoteroPDFTranslate._sourceText = text
        const success = await Zotero.ZoteroPDFTranslate.translate.getTranslation()
        if (!success) {
          Zotero.ZoteroPDFTranslate.view.showProgressWindow(
            "Translate Failed",
            success,
            "fail"
          );
          return
        }
        return Zotero.ZoteroPDFTranslate._translatedText;
      } else if (Zotero.PDFTranslate) {
        return (await Zotero.PDFTranslate.api.translate(text))?.result
      }
    }
    let translateNode = async function (event: any) {
      if (
        (
          (Zotero.isMac && event.metaKey && !event.ctrlKey) ||
          (!Zotero.isMac && event.ctrlKey)
        ) &&
        Zotero.Prefs.get(`${config.addonRef}.ctrlClickTranslate`)
      ) {
        // @ts-ignore
        let node = this as HTMLElement
        let sourceText = node.getAttribute("sourceText")
        let translatedText = node.getAttribute("translatedText")!
        console.log(sourceText, translatedText)
        if (!sourceText) {
          sourceText = node.innerText;
          node.setAttribute("sourceText", sourceText)
        }
        if (!translatedText) {
          translatedText = await translate(sourceText)
          node.setAttribute("translatedText", translatedText)
        }

        if (node.innerText == sourceText) {
          console.log("-> translatedText")
          node.innerText = translatedText
        } else if (node.innerText == translatedText) {
          node.innerText = sourceText
          console.log("-> sourceText")
        }
      }
    }
    const isSelect = (
      (index !== undefined && prefIndex !== undefined && index == prefIndex) ||
      this.container.querySelector("#option-container")!.childNodes.length == 0
    )
    if (isSelect) { this.reset() }
    const contentNode = ztoolkit.UI.createElement(
      document,
      "div",
      {
        classList: ["zotero-reference-tip"],
        styles: {
          padding: "0px",
          width: "100%",
          display: isSelect ? "" : "none"
        },
        subElementOptions: [
          {
            tag: "span",
            classList: ["title"],
            styles: {
              display: "block",
              fontWeight: "bold",
              marginBottom: ".25em",
              fontSize: "1.2em",
              color: Zotero.Prefs.get(`${config.addonRef}.tipTitleColor`) as string
            },
            directAttributes: {
              innerText: title
            },
            listeners: [
              {
                type: "click",
                listener: translateNode
              }
            ]
          },
          ...(tags && tags.length > 0 ? [{
            tag: "div",
            id: "tags",
            styles: {
              width: "100%",
              // margin: "0.5em 0",
            },
            subElementOptions: ((tags) => {
              if (!tags) { return [] }
              let arr = []
              for (let tag of tags) {
                arr.push({
                  tag: "span",
                  directAttributes: {
                    innerText: tag.text
                  },
                  styles: {
                    backgroundColor: tag.color,
                    borderRadius: "10px",
                    margin: "0.5em 1em 0.5em 0px",
                    display: "inline-block",
                    padding: "0 8px",
                    color: "white",
                    cursor: "pointer",
                    userSelect: "none"
                  },
                  listeners: [
                    {
                      type: "click",
                      listener: () => {
                        if (tag.url) {
                          (new ztoolkit.ProgressWindow("Launching URL"))
                            .createLine({ text: tag.url, type: "default"})
                            .show()
                          Zotero.launchURL(tag.url);
                        } else if (tag.item) {
                          this.clear()
                          Zotero.ProgressWindowSet.closeAll();
                          this.utils.selectItemInLibrary(tag.item)
                        }
                        else {
                          this.utils.copyText(tag.text)
                        }
                      }
                    },
                    {
                      type: "mouseenter",
                      listener: () => {
                        if (!tag.tip) { return }
                        Zotero.ProgressWindowSet.closeAll();
                        (new ztoolkit.ProgressWindow("Reference", { closeTime: -1 }))
                          .createLine({ text: tag.tip, type: "default" })
                          .show()
                      }
                    },
                    {
                      type: "mouseleave",
                      listener: () => {
                        if (!tag.tip) { return }
                        Zotero.ProgressWindowSet.closeAll();
                      }
                    }
                  ]
                })
              }
              return arr
            })(tags) as any
          }] : []),
          ...(descriptions && descriptions.length > 0 ? [{
            tag: "div",
            id: "descriptions",
            styles: {
              marginBottom: "0.25em"
            },
            children: ((descriptions) => {
              if (!descriptions) { return [] }
              let arr = [];
              for (let text of descriptions) {
                arr.push({
                  tag: "span",
                  id: "content",
                  styles: {
                    display: "block",
                    lineHeight: "1.5em",
                    opacity: "0.5",
                    cursor: "pointer",
                    userSelect: "none"
                  },
                  properties: {
                    innerText: text
                  },
                  listeners: [
                    {
                      type: "click",
                      listener: () => {
                        this.utils.copyText(text)
                      }
                    }
                  ]
                })
              }
              return arr
            })(descriptions) as any
          }] : []),
          {
            tag: "span",
            id: "content",
            properties: {
              innerText: content
            },
            styles: {
              display: "block",
              lineHeight: "1.5em",
              textAlign: "justify",
              opacity: "0.8",
              maxHeight: "300px",
              overflowY: "auto",
              marginTop: ".25em"
            },
            listeners: [
              {
                type: "click",
                listener: translateNode
              }
            ]
          }
        ]
      }
    ) as HTMLDivElement
    const optionNode = ztoolkit.UI.createElement(
      document,
      "div",
      {
        id: `option-${index}`,
        styles: {
          width: `${this.option.size}px`,
          height: `${this.option.size}px`,
          borderRadius: "50%",
          backgroundColor: isSelect ? this.option.color.active : this.option.color.default,
          marginLeft: `${this.option.size * .5}px`,
          marginRight: `${this.option.size * .5}px`,
          cursor: "pointer",
          transition: "background-color 0.23s linear"
        },
        listeners: [
          {
            type: "click",
            listener: () => {
              this.reset()
              optionNode.style.backgroundColor = this.option.color.active
              contentNode.style.display = ""
              Zotero.Prefs.set(`${config.addonRef}.${according}InfoIndex`, index!)
              this.place()
            },
          },
          {
            type: "mouseenter",
            listener: () => {
              let tag = tags.find(tag => tag.source)
              let source = (
                (tag && tag.source && according && `${tag.source} view according to ${according}`) ||
                "reference view"
              )
              Zotero.ProgressWindowSet.closeAll();
              (new ztoolkit.ProgressWindow("Reference", {closeTime: -1}))
                .createLine({ text: source, type: "default" })
                .show()
            }
          },
          {
            type: "mouseleave",
            listener: () => {
              Zotero.ProgressWindowSet.closeAll();
            }
          }
        ]
      }
    ) as HTMLDivElement
    const optionContainer = this.container.querySelector("#option-container")!;
    const optionNodes = [...optionContainer.querySelectorAll("[id^=option]")] as HTMLElement[]
    if (optionNodes.length == 0) {
      optionContainer.appendChild(optionNode)
    } else {
      let getIndex = (node: HTMLElement) => Number(node.id.split("-")[1])
      for (let i = 0; i < optionNodes.length; i++) {
        if (index > getIndex(optionNodes[i])) {
          if (i + 1 < optionNodes.length) {
            if (index < getIndex(optionNodes[i + 1])) {
              optionContainer.insertBefore(optionNode, optionNodes[i + 1])
              break
            }
          } else {
            optionContainer.appendChild(optionNode)
            break
          }
        } else {
          optionContainer.insertBefore(optionNode, optionNodes[i])
          break
        }
      }
    }
    this.container.querySelector("#content-container")!.appendChild(contentNode)
    this.place()
  }

  private reset() {
    this.container.querySelector("#content-container")!
      .childNodes
      .forEach((e: any) => {
        e.style.display = "none"
      })
    this.container.querySelector("#option-container")!
      .childNodes
      .forEach((e: any) => {
        e.style.backgroundColor = this.option.color.default
      })
  }

  private zoom(event: any) {
    let _scale = this.container.style.transform.match(/scale\((.+)\)/)
    let scale = _scale ? parseFloat(_scale[1]) : 1
    let minScale = 1, maxScale = 1.7, step = 0.05
    if (this.container.style.bottom == "0px") {
      this.container.style.transformOrigin = "center bottom"
    } else {
      this.container.style.transformOrigin = "center center"
    }
    if (event.detail > 0) {
      // 缩小
      scale = scale - step
      this.container.style.transform = `scale(${scale < minScale ? minScale : scale})`;
    } else {
      // 放大
      scale = scale + step
      this.container.style.transform = `scale(${scale > maxScale ? maxScale : scale})`;
    }
  }
}