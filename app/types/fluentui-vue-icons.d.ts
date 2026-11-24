/**
 * @ntkrnl64/fluentui-vue-icons 发布的 npm 包未附带 dist/index.d.ts（package.json 里声明了该文件但实际不存在）
 * 按约定先跳过该包的类型检查：使用简写形式的环境模块声明，让所有来自该包的导入均为 any，运行时行为不受影响
 */
declare module "@ntkrnl64/fluentui-vue-icons";
