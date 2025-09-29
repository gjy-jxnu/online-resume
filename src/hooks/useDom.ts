// 为所有带指定类名的元素设置可编辑
function setEditableByClass(className: string) {
  if (!className) return;
  const elements = document.getElementsByClassName(className);
  Array.from(elements).forEach((el) => {
    (el as HTMLElement).contentEditable = "true";
  });
}

/**
 * 沿 DOM 树向上查找包含指定类名的祖先元素（包含当前元素本身）
 * @param {HTMLElement} element - 起始 DOM 元素（必须是有效的 HTMLElement）
 * @param {string} targetClassName - 要查找的目标类名（不允许为空字符串）
 * @returns {HTMLElement|null} - 找到的目标元素（未找到则返回 null）
 * @throws {TypeError} - 若输入参数类型不合法，抛出类型错误
 */
function findAncestorByClass(element: HTMLElement, targetClassName: string) {
  // 1. 输入参数校验（避免非法调用导致报错）
  // 校验 element 是否为有效的 HTMLElement
  if (!(element instanceof HTMLElement)) {
    throw new TypeError(
      "第一个参数必须是有效的 HTMLElement（如 div、span 等 DOM 元素）"
    );
  }
  // 校验 targetClassName 是否为非空字符串
  if (typeof targetClassName !== "string" || targetClassName.trim() === "") {
    throw new TypeError("第二个参数必须是非空的类名字符串");
  }
  // 去除类名前后空格（避免用户误输入空格导致匹配失败）
  const trimmedClassName = targetClassName.trim();

  // 2. 初始化当前查找的元素（从传入的 element 开始）
  let currentElement: HTMLElement | null = element;

  // 3. 循环向上查找（直到找到目标元素或到达 DOM 树顶部）
  while (currentElement) {
    // 检查当前元素是否包含目标类名（用 classList.contains 精确匹配，避免部分匹配问题）
    if (currentElement.classList.contains(trimmedClassName)) {
      return currentElement; // 找到目标，直接返回
    }
    // 未找到，向上移动到父元素（parentElement 会跳过文本节点，只取元素节点，比 parentNode 更安全）
    currentElement = currentElement.parentElement;
  }

  // 4. 遍历完所有祖先仍未找到，返回 null
  return null;
}

export { setEditableByClass, findAncestorByClass };
