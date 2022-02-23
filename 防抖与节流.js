// 防抖（debounce）
/*
    在一次触发事件时，不立即执行函数，而是给出一个期望的延迟
        如果期望延迟内没有再次触发事件则执行回调函数
        如果再次触发事件，则当前计时取消
*/
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}

// lodash中实现防抖的源码
function debounce(func, wait, options) {
  var lastArgs, // 最后一次debounce的arguments， 起到一个标记的作用
    lastThis,
    maxWait,
    result,
    timerId,
    latCallTime,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR);
  }

  // 此处有一个toNumber()是lodash封装的一个转化类型的方法，此处没有引用，就不写了,默认就是Number类型
  // wait = toNumber(wait) || 0;

  // 获取用户传入的配置
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options; // 此处需要判定是否有最大等待时间
    maxWait = maxing
      ? nativeMax(toNumber(options.maxWait) || 0, wait)
      : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
    //  执行用户传入的函数
    function invokeFunc(time) {
      // ......
    }

    //  防抖开始时执行的操作
    function leadingEdge(time) {
      // ......
    }

    //  计算仍然需要等待的时间
    function remainingWait(time) {
      // ......
    }

    //  判断此时是否应该执行用户传入的函数
    function shouldInvoke(time) {
      // ......
    }

    //  等待时间结束后的操作
    function timerExpired() {
      // ......
    }

    //  执行用户传入的函数
    function trailingEdge(time) {
      // ......
    }

    //  取消防抖
    function cancel() {
      // ......
    }

    //  立即执行用户传入的函数
    function flush() {
      // ......
    }

    // 防抖开始的入口
    function debounced() {
      var time = now(),
        isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
          // 如果此时没有定时器的存在，开始进行防抖
          if(timerId === undefined) {
              return leadingEdge(lastCallTime);
          }
          if (maxing) {
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
          }
      }
      if(timerId ===undefined) {
          timerId = setTimeout(timerExpired, wait)
      }
      return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
}

// 节流（throttle）
/*
    在函数执行一次之后， 该函数在指定时间期限内不再工作，直至过了这段时间才重新生效
*/
function throttle(fn, delay) {
  let valid = true;
  return function () {
    if (!valid) {
      return false;
    }
    valid = false;
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  };
}
