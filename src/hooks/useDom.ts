// 为所有带指定类名的元素设置可编辑
function setEditableByClass(className: string) {
  if (!className) return;
  const elements = document.getElementsByClassName(className);
  Array.from(elements).forEach((el) => {
    (el as HTMLElement).contentEditable = "true";
  });
}

export { setEditableByClass };
