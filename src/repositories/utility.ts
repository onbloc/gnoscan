export function getDefaultMessage<T = any>(
  messages: {
    value: any;
  }[],
): T {
  return messages.sort((m1, m2) => {
    if (m1.value?.func === 'Approve') {
      return 1;
    }
    if (m2.value?.func === 'Approve') {
      return -1;
    }
    return 0;
  })[0] as T;
}
export function getDefaultMessageByBlockTransaction<T = any>(messages: any[]): T {
  return messages.sort((m1, m2) => {
    if (m1?.func === 'Approve') {
      return 1;
    }
    if (m2?.func === 'Approve') {
      return -1;
    }
    return 0;
  })[0] as T;
}
