export function isStringEmpty(value) {
  if (value.trim() === "") {
    return true;
  }
  return false;
}
export function isString(value) {
  if (typeof value !== "string") {
    return true;
  }
  return false;
}

export function isObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function isObjectEmpty(obj) {
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

export function isArray(array) {
  if (Array.isArray(array)) {
    return true;
  }
  return false;
}

export function isArrayEmpty(array) {
  if (array.length === 0) {
    return true;
  }
  return false;
}
