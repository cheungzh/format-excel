import xlsx from 'node-xlsx';
import { isEqual, format } from './util/index';
import { Title, Limit, ExcelOptions, Rules } from './interface';
/**
 * 表格格式化校验
 * @method: getParse() 返回格式化的数据
 * @method: validate(rule) 表格校验
 * @example: 
 *   let excel = new Excel({
 *       title: { data: [], errorHandle } 表格头
 *       props: [] 表格字段对应key
 *       source: [] 重复校验初始值
 *       limit: {
 *          max: 100,
 *          errorHandle: Function|String
 *       } 限制上传数量
 *       errorHandle: Function 统一的错误处理函数
 *       source: [] // 重复校验初始数据
 *    })
 * 
 *    xlsx.validate(
 *        {
 *         key: [{
 *            required: true, 
 *            unique: true, 是否唯一
 *            message: '**{}**{}', 消息可格式化
 *            key: ['index', 'mac'], 格式化字段
 *            validator: Function, 自定义检验方法
 *          }]
 *        }
 *   )
*/
export default class Excel {
  private sheets;
  private title;
  private props;
  private limit;
  private source;
  private errorHandle;
  constructor(excel: Buffer,options: ExcelOptions) {
    let { title, props, limit = {}, errorHandle, source} = options;
    this.title = title;
    this.props = props;
    this.limit = limit;
    this.source = source;
    this.errorHandle = errorHandle;
    this.sheets = this.parse(excel);
    this.validTitle(this.sheets);
    this.validLimit(this.sheets);
  }
  parse(file: Buffer) {
    return xlsx.parse(file).reduce((sheets, sheet) => {
      let { name, data } = sheet;
      sheets[name] = {
        head: data.shift(),
        content: data
      }
      return sheets;
    }, {})
  }
  getParse() {
    let content = this.mergeSheet(this.sheets);
    let props = this.props;
    return content.map((list) => {
      return this.transform(list, props);
    })
  }
  validTitle(sheets) {
    for (let name in sheets) {
      let { head } = sheets[name];
      this.validSheetTitle(head, name)
    }
  }
  validSheetTitle(head: string[], name: string) {
    let { data, errorHandle, message }  = this.title;
    errorHandle = typeof errorHandle === 'function' ? errorHandle : this.errorHandle
    let valid = isEqual(data, head);
    if (!valid) {
      errorHandle(message);
      throw Promise.reject(message);
    }
  }
  validLimit(sheets) {
    let { max, errorHandle, message } = this.limit;
    errorHandle = typeof errorHandle === 'function' ? errorHandle : this.errorHandle 
    let len = this.mergeSheet(sheets).filter(item => item.length > 0);
    if (len > max) {
      errorHandle(message);
      throw Promise.reject(message);
    }
  }
  validate(rules: Rules) {
    let content = this.getParse();
    content.forEach((list, index) => {
      for (let type in rules) {
        this.valid(rules[type], list, type, index, content);
      }
    })
    
  }
  valid(rules, list, type, index, content) {
    rules.map(rule => {
      let { required, unique, validator, message, keys = [] } = rule;
      let errorHandle = this.errorHandle ? this.errorHandle : this.defaultHandle;
      typeof validator === 'function' && validator(list[type], index + 1, content);
      if (typeof message === 'string' && keys.length) {
        message = format(message, keys, content[index]);
      }
      if (required && !list[type]) { errorHandle(message) };
      if (unique && this.checkRepeat(content, list[type], type)) {
        errorHandle(message);
      }
    })
  }
  mergeSheet(sheets) {
    let data = Object.keys(sheets).reduce((data, name) => {
      data.push(...sheets[name].content);
      return data;
    }, []);
    return data;
  }
  transform(content, props) {
    return props.reduce((result, prop, index) => {
      result[prop] = content[index] || '';
      return result;
    }, {})
  }
  checkRepeat(content, value, type) {
    let contents = [...content, this.source];
    return contents.some(content => content[type] === value)
  }
  defaultHandle(message) {
    throw new Error(message); 
  }
}