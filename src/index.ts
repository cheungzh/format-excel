import Excel from './excel';
import * as moment from 'moment';
let fs = require('fs');
let buffer = fs.readFileSync('../public/device_track.xlsx');
let xlsx = new Excel(buffer, {
  title: {
    data: ['序号', '丢失设备PN', '丢失设备IMEI', '丢失设备MAC', '设备丢失时间', '被盗设备型号'],
    errorHandle: (name) => {
      throw new Error('表格格式异常')
    }
  },
  props: ['_index', 'pn', 'imei', 'mac', 'lost_time', 'type'],
  limit: { max: 1 },
  errorHandle: (message) => {
    throw new Error(message)
  },
  source: [
    { 
      _index: 1,
      pn: '157*****231',
      imei: '',
      mac: '',
      lost_time: ' 2018-10-23 12:32',
      type: '苹果6'
    }]
});
console.log(xlsx.getParse())
xlsx.validate({
  mac: [
    // { required: true, message: '导入失败, 第{}条缺少mac信息', keys: ['_index'] },
    { unique: true, message: '导入失败, 第{}条重复录入', keys: ['_index'] }
  ],
  pn: [
    { unique: true, message: '导入失败, 第{}条重复录入', keys: ['_index'] } 
  ],
  lost_time: [
    { validator: (value, index) => {
      if (moment(value).isBefore(moment())) {
        throw new Error(`导入失败, 第${index}条, 设备丢失时间不能早与今天`);
      }
    } }
  ]
})