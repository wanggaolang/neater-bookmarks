# Neater Bookmarks

一款整洁的 Chrome 书签树弹出扩展。基于 [MIT 许可证](http://www.opensource.org/licenses/mit-license.php) 开源。

基于 [Lim Chee Aun](http://cheeaun.com/) 的 [Neat Bookmarks](https://github.com/cheeaun/neat-bookmarks) 项目。

部分代码参考（甚至直接借鉴）了 [vBookmarks](https://github.com/windviki/vBookmarks)，感谢 windviki！

欢迎通过 [WebTranslateIt](https://webtranslateit.com/en/projects/4222-Neater-Bookmarks) 帮助翻译。

# 常见问题

### 能调整弹出窗口的宽高吗？

宽度可以调整：拖动弹出窗口左侧（RTL 系统为右侧）边缘即可。高度不可手动调整，会根据书签树高度自动变化。注意 Chrome 对扩展弹出窗口设有 800×600 的最大尺寸限制。

### 能把 `*` 快捷键改成其他按键吗？

可以。前往 Chrome > 设置 > 搜索 > [管理搜索引擎](chrome://settings/searchEngines) > 扩展程序添加的搜索引擎，在对应条目中修改即可。

### 为什么不用更原生外观的工具栏图标？

Chrome 自带的工具栏图标只是简单的字形和形状，能根据主题动态变色。扩展图标除了表明功能外，还承担品牌标识的作用，且不能随主题变色。如果图标只用单色（如黑色），深色主题下会显得格格不入。不过，Neater Bookmarks 在选项菜单中提供了自定义工具栏图标的功能。

### 可以做成侧边栏而不是弹出窗口吗？

请关注 [此 issue](http://crbug.com/51084)。

### 有键盘快捷键可以打开 Neater Bookmarks 弹出窗口吗？

可以自行添加：前往 [扩展程序页面](chrome://extensions/)，点击页面底部的"键盘快捷键"链接，在 "Neater Bookmarks" 对应的输入框中输入想要的快捷键（如 Ctrl+B）。设置后，该快捷键将打开弹出窗口并自动聚焦到搜索框；输入文字即可立即搜索书签，按方向键可在书签树中导航。

### 搜索结果有快捷键吗？

搜索书签时，前 9 条结果的左侧会显示数字序号 1–9。

- **Windows / Linux**：按 **Alt+1** 到 **Alt+9** 可直接打开对应序号的书签。
- **Mac**：按 **Option+1** 到 **Option+9** 效果相同。

### Neater Bookmarks 支持 Google 书签吗？

不支持，也没有计划支持。原因是 Google 书签缺乏官方公开 API，而 Chrome 本身已内置带同步功能的书签系统。如有需要，市面上有若干专门支持 Google 书签的 Chrome 扩展可供选择。

### 如何反馈 Bug 或提交功能建议？

推荐通过 [issue 追踪器](https://github.com/evanshultz/neater-bookmarks/issues) 或发送邮件至 <neaterbookmarks@gmail.com>。反馈 Bug 时请尽量附上 Chrome 版本及操作系统信息。

### 为什么 Chrome 不把这个功能内置进去？

不知道，这就是 Neater Bookmarks 存在的原因。

# 技术细节

Neater Bookmarks 曾基于 [MooTools](http://mootools.net/) 构建，现已改用 Neatools —— 一个自定义的轻量级 MooTools 子集。选项页中的自定义 CSS 编辑器使用了 [CodeMirror](http://codemirror.net/)。
