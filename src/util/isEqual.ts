function isEqual(target, source) {
  if (typeof target !== typeof source) return false;
  if (typeof target === typeof source && typeof target !== 'object') return target === source;
  if (target === null) return target === source;
  if (Array.isArray(target)) {
    return isEqualArray(target, source);
  }
  return isEqualObject(target, source);
}

export function isEqualArray(target: Array<any>, source: Array<any>) {
  if (target.length !== source.length) return false;
  for (let i = 0; i < target.length; i++) {
    if (target[i] !== source[i]) return false;
  }
  return true;
}

export function isEqualObject(target: Object, source: Object) {
  if (Object.keys(target).length !== Object.keys(source).length) return false;
  for (let key in target) {
    if (target[key] !== source[key]) return false
  }
  return true;
}

export default isEqual;