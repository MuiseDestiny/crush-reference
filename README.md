# Zotero Reference

![Reference](addon/chrome/content/icons/favicon.png)

[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-round&logo=github)](https://github.com/windingwind/zotero-plugin-template)
[![Latest release](https://img.shields.io/github/v/release/MuiseDestiny/zotero-reference)](https://github.com/MuiseDestiny/zotero-reference/releases)
![Release Date](https://img.shields.io/github/release-date/MuiseDestiny/zotero-reference?color=9cf)
[![License](https://img.shields.io/github/license/MuiseDestiny/zotero-reference)](https://github.com/MuiseDestiny/zotero-reference/blob/master/LICENSE)
![Downloads latest release](https://img.shields.io/github/downloads/MuiseDestiny/zotero-reference/latest/total?color=yellow)


Hi, [PDF解析失败反馈](https://github.com/MuiseDestiny/zotero-reference/issues/6)

--- 

🎈 首次使用建议打开首选项，进行个性化配置，**插件不生产数据，只是数据的搬运工**

> 浮窗顶部小圆点代表不同的数据源，点击切换源

![标准视图](https://user-images.githubusercontent.com/51939531/226575476-3234f112-877a-4b6e-a110-ecc3aee72d26.png)

![堆叠视图](https://user-images.githubusercontent.com/51939531/227147529-bd6b97ee-4d5e-4239-adb9-591cdc3a88cb.png)


## 👋 使用

### 刷新

> 小小刷新，大有乾坤

![image](https://user-images.githubusercontent.com/51939531/221145006-56834b6e-e5c2-4bb4-a369-cfcf15a53349.png)

|操作|触发|说明|
|--|--|--|
| 点击 | 解析/获取当前PDF的参考文献 | 第一次点击会从首选项设置的优先源获取，再次点击刷新会切换到另一个源 |
| 长按 | 如果本地有当前PDF的参考文献缓存，默认是会读取它的，长按则不读取重新解析 | 所有源都适用 |
| `Ctrl` + 点击/长按 | 从当前所在页向前解析参考文献 | 适用于PDF源，对API源无效，建议解析硕博论文时使用，需要提前将PDF滚动到最后一条参考文献所在页面 | 
| 双击上图`31条参考文献`文字 | 复制当前所有参考文献到剪贴板 | |

### 参考文献

![image](https://user-images.githubusercontent.com/51939531/208303590-dfe6f3cf-cd48-4afe-90a0-9cce6ff5f9cb.png)

![image](https://user-images.githubusercontent.com/51939531/221150190-934a1c03-99ff-421a-880b-8c1b4b185898.png)

![image](https://user-images.githubusercontent.com/51939531/208303399-0dc09046-997c-4809-8639-9100001e6002.png)

|操作|触发|说明|
|--|--|--|
|单击蓝色区域|复制参考文献信息|连同标识符一起复制，如DOI|
|长按蓝色区域| 编辑参考文献信息 | 建议中文参考文献使用编辑功能以精简条目，提高导入成功率 |
|`Ctrl`+单击蓝色区域|用系统浏览器打开文献URL|偶尔会查询文献地址消耗一定的时间|
|单击`+`|添加参考文献到正在阅读文献所在的所有文件夹下，并双向关联||
|`Ctrl`+单击`+`|添加到`Zotero主面板`选择的文件夹下，并双向关联|如上图的GEE|
|单击`-`|取消双向关联|但是不会删除该文献，它仍在`我的文库`中|




**浮窗**

支持下列源
* PDF（默认）
* readpaper（标题搜索）
* crossref（标题，DOI搜素）
* semanticscholar（DOI搜素）
* arXiv（arXivID搜索）

![image](https://user-images.githubusercontent.com/51939531/217994089-100d5d20-8a6b-42ec-ad9b-5550cf354366.png)

**浮窗内文字可选择复制**

![image](https://user-images.githubusercontent.com/51939531/217994406-64e96f4e-68bf-49bf-bda3-f6fe4a003df9.png)

**放大/缩小**

> ctrl+鼠标滚轮

![image](https://user-images.githubusercontent.com/51939531/217994453-686cc320-d2bf-49dc-be73-6b95cd5cdbfb.png)

**翻译**
> 需要安装[zotero-pdf-translate](https://github.com/windingwind/zotero-pdf-translate)插件
> 
> ctrl+鼠标左键在原文/译文之间自由切换

![image](https://user-images.githubusercontent.com/51939531/217994498-87ce1191-407f-45e1-bf97-ddd178375d07.png)

**分栏快速跳转**
> 主阅读界面若有跳转链接如`Fig 4`，点击后会在分割界面（横向/竖向）跳转，主阅读界面无跳转，避免点击前进后退。可满足看图，公式，表格的需求。但只针对有跳转链接的PDF。

![image](https://user-images.githubusercontent.com/51939531/209768934-c959f54c-09d2-47e9-871c-defe42074afe.png)

如何关闭？下图取消勾选

![image](https://user-images.githubusercontent.com/51939531/217995465-d5893305-c0d2-4c50-b4ca-42c50d2f077c.png)

**推荐关联**
> 来自`readcube API`

![图片1](https://user-images.githubusercontent.com/51939531/209890021-14b421a6-f5d8-476f-801f-294a8104f95f.png)

**设置界面**

- `自动抓取参考文献` - 是否在文献被打开时自动抓取参考文献
- `下述条目类型...` - 排除一些类型的文献，一般它们页数过多，若自动刷新往往会带来影响
- `优先从...` - 第一次点击刷新从PDF/URL解析
- `ctrl点击...` - 勾选后悬浮的摘要标题可通过按住ctrl+点击以翻译（基于zotero-pdf-translate插件，需要提前安装）

**注意**：即便设置了不自动刷新，或者正在阅读的文献类型被你设置为不自动刷新，你仍然可以通过点击刷新来抓取参考文献。
条目类型的输入为英文，且`,`隔开，现将所有字段列出，通过翻译可找到对应中文：
<details>
<summary>所有类型中英对照</summary>
  
  ```
  note=笔记
  annotation=注释
  attachment=附件
  book=图书
  bookSection=图书章节
  journalArticle=期刊文章
  magazineArticle=杂志文章
  newspaperArticle=报纸文章
  thesis=学位论文
  letter=信件
  manuscript=手稿
  interview=采访稿
  film=电影
  artwork=艺术品
  webpage=网页
  report=报告
  bill=法案
  case=司法案例
  hearing=听证会
  patent=专利
  statute=法律
  email=E-mail
  map=地图
  blogPost=博客帖子
  instantMessage=即时讯息
  forumPost=论坛帖子
  audioRecording=音频
  presentation=演示文档
  videoRecording=视频
  tvBroadcast=电视广播
  radioBroadcast=电台广播
  podcast=播客
  computerProgram=软件
  conferencePaper=会议论文
  document=文档
  encyclopediaArticle=百科全书文章
  dictionaryEntry=词条
  preprint=预印本
  ```
  
</details>

## 🕊️ TODO
- [x] 根据反馈，是否需要在主界面（非阅读状态）添加`参考文献`到侧边栏，目前仅阅读状态下添加
- [x] 是否需要全部导入，或多选导入功能
- [x] 是否需要中文支持，如果需要请提供网站或参考文献获取方案（已支持知网）
- [ ] 是否需要针对特定期刊改变参考文献获取策略
- [ ] 根据条目类型改变参考文献条目图标

## 👋 说明

1. 本插件的自动关联功能与`scihub`插件不兼容

## 🍭 致谢

本插件基于模板：

- [zotero-addon-template](https://github.com/windingwind/zotero-addon-template)

本插件部分功能基于插件:

- [茉莉花/jasminum](https://github.com/l0o0/jasminum)
- [zotero-pdf-translate](https://github.com/windingwind/zotero-pdf-translate)

代码参考：

- [zotero-pdf-translate](https://github.com/windingwind/zotero-pdf-translate)
- [chartero](https://github.com/volatile-static/Chartero)

API：
- [unpaywall](https://api.unpaywall.org/)
- [crossref](https://github.com/CrossRef/rest-api-doc)
- [readpaper](https://readpaper.com/)
- [readcube](https://www.readcube.com/)

## 赞助

<img src="https://user-images.githubusercontent.com/51939531/227145474-ca165a93-fcf2-4b47-baf4-ea6b29f43d99.png" width="50%" height="50%">


感谢[@leichaoL](https://github.com/leichaoL)、[@JOJOdioJosita](https://github.com/JOJOdioJosita)、@小陈、[@YangChunyu1999](https://github.com/YangChunyu1999)、[@遍一认着倒要少至你赌我](https://b23.tv/JjHR5ON)以及一些匿名赞助的朋友们，也感谢很治愈的留言
  
