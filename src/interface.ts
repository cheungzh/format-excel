interface Title {
  data: Array<string>;
  errorHandle?: Function|string;
}
interface Limit {
  max?: number;
  errorHandle?: Function|string
}
interface ExcelOptions {
  title: Title;
  props: string[];
  limit?: Limit;
  errorHandle?: Function;
  rules?: Object
  source?: any[]
}
interface Rules {
  [propName: string]: Array<any>
}
export { Title, Limit, ExcelOptions, Rules }