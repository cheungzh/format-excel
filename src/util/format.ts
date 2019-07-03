/**
   * 
   * @param str 格式化的字符串
   * @param keys 格式化的字段
   * @param source 数据源头
   * @return 返回格式化的字符串 
   * @example: format('**{}**{}**', ['index', 'mac'], { index: 1, mac: '1277878784' }) -> '**1**1277878784**'
   */
  export default function format(str: string, keys: any[], source) {
    let reg: RegExp = /(\{\})/;
    let index = 0;
    while(reg.test(str)) {
      str =  str.replace(reg, `${source[keys[index]]}`);
      index++
    }
    return str;
  }