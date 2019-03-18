import fetch from '../core/fetch';
import message from 'antd/lib/message';

/**
 * 功能：设置fetch的选项
 */
const postOption = (body, method = 'post') => {
  return {
    method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  }
};

/**
 * 功能：发送请求，并解析json
 */
const fetchJson = async (url, option, cookie=true) => {
  if (cookie) {
    if (typeof option === 'undefined') {
      option = {credentials: 'include'};
    } else if (typeof option === 'string') {
      option = {method: option, credentials: 'include'};
    } else if (!option.credentials) {
      Object.assign(option, {credentials: 'include'});
    }
  } else {
    if (typeof option === 'string') {
      option = {method: option};
    }
  }

  try {
    const res = await fetch(url, option);
    if (!res.ok) {
      return {returnCode: res.status, returnMsg: `${res.status} - ${res.statusText}`};
    } else {
      const json = await res.json();
      if (json.returnCode !== 0 && json.errorCode) {
        json.returnCode = Number(json.errorCode) || 10001;
      }
      return json;
    }
  } catch (e) {
    return {returnCode: 10000, returnMsg: '无法请求资源'};
  }
};

// node端获取json数据
const fetchJsonByNode = (req, url, option) => {
  const {token} = req.cookies;
  const cookie = {'Cookie': `token=${token}`};
  if (typeof option === 'string') {
    option = {method: option, headers: cookie};
  } else if (typeof option === 'undefined') {
    option = {headers: cookie};
  } else if (option.headers) {
    Object.assign(option.headers, cookie);
  } else {
    Object.assign(option, {headers: cookie});
  }
  return fetchJson(url, option, false);
};

/**
 * 功能：如果returnCode不为0，则抛出异常，否则取出result
 * 参数：从服务端获取的JSON格式数据
 */
const getJsonResult = (json) => {
  if (json.returnCode !== 0) {
    const error = new Error();
    error.message = json.returnMsg;
    error.code = json.returnCode;
    throw error;
  } else {
    return json.result;
  }
};

/**
 * 功能：从obj中提取出指定属性，并构造出一个新的对象
 *  obj：[必须]，对象
 *  keys：[必须]，字符串数组，用于指定需要提取的属性
 * 返回值：返回构造出的对象
 */
const getObject = (obj, keys) => {
  return keys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj;
  }, {});
};

/**
 * 功能：从obj中取出不包含keys指定的属性，并组成一个新的子对象
 */
const getObjectExclude = (obj, keys) => {
  const inKeys = key => keys.some(k => k === key);
  return  Object.keys(obj).reduce((newObj, key) => {
    !inKeys(key) && (newObj[key] = obj[key]);
    return newObj;
  }, {});
};

/**
 * 功能：判断一个值是否为空(null,undefined和''属于空)
 */
const isEmpty = (value) => {
  const type = typeof value;
  if (type === 'number' || type === 'boolean') {
    return false;
  } else {
    return !value;
  }
};

/**
 * 功能：判断一个值是否为空(null,undefined,''和[]属于空)
 */
const isEmpty2 = (value) => {
  const type = typeof value;
  if (type === 'number' || type === 'boolean') {
    return false;
  } else if (Array.isArray(value)) {
    return !value.length;
  } else {
    return !value;
  }
};

/**
 * 功能：依据fields来验证value中指定属性(key)是否为空
 *  fields：[必须]，对象数组，每个对象用于描述value中的相应的属性是否为必填项(不能为空)
 *   对象中必须有key属性，以及可选的required属性，required为true表明指示的key为必填项
 *  value：[必须]，对象(key-value对)
 * 返回值：通过校验返回true，未通过返回false
 */
const validValue = (fields, value) => {
  return fields.every(({key, required}) => {
    return !required || !isEmpty2(value[key]);
  });
};

const validArray = (fields, array) => {
  return !array.some(item => !validValue(fields, item));
};

const showError = (msg) => {
  message.error(msg);
};

const showSuccessMsg = (msg) => {
  message.success(msg);
};

// 如果text超过最大长度maxLength，剩余部分用省略号表示
const omit = (text, maxLength = 6) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// 下载文件
const download = (url, name) => {
  if (url.substr(0, 4) === 'http') {
    window.open(url);
  } else {
    const node = document.createElement('a');
    node.href = url;
    node.download = name;
    node.target = '_blank';
    if (node.getAttribute('download')) {
      document.body.appendChild(node);
      node.click();
      document.body.removeChild(node);
    } else {
      window.open(url);
    }
  }
};

// 获取当前时间
const getCurrentTime = () => {
  const T = new Date();
  const date = formatTime(T);
  const time = T.toTimeString().split(' ')[0];
  return `${date} ${time}`;
};

const helper = {
  postOption,
  fetchJson,
  getObject,
  getObjectExclude,
  isEmpty,
  isEmpty2,
  validValue,
  validArray,
  showError,
  showSuccessMsg,
  getJsonResult,
  fetchJsonByNode,
  omit,
  download,
  getCurrentTime
};

export default helper;
