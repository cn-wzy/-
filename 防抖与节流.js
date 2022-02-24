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
      var args = lastArgs, 
          thisArg = lastThis;
      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    //  防抖开始时执行的操作
    function leadingEdge(time) {
      lastInvokeTime = time;
      // 设置定时器，保证wait接下来的执行
      timerId = setTimeout(timerExpired, wait);
      // 如果判断leading是true的话，立即执行传入的函数
      return leading ?  invokeFunc(time) : result;
    }

    //  计算仍然需要等待的时间
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime;
          timeSinceLastInvoke = time - lastInvokeTime;
          timeWaiting =  wait - timeSinceLastCall;
      // 判断是否存在最大等待时间，如果存在返回，需等待的时间到最后一次调用debounce 和 最大等待时间到上一次执行用户传入函数的时间的最小值
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    //  判断此时是否应该执行用户传入的函数
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;
          return (
            latCallTime === undefined || // 首次执行没有lastCallTime
            (timeSinceLastCall >= wait) || // 距离上次调用的时间已经大于设置的wait值
            (timeSinceLastCall < 0) || // 不知道为什么会出现这种情况，可能调整了系统时间？
            (maxing && timeSinceLastInvoke >= maxWait) // 设置了最大等待时间，并且等待时间超过了最大等待时间
          );
    }

    //  等待时间结束后的操作,判断是否符合执行条件，符合的话触发trailingEdge，否则就需要计算需要等待的时间，并重新掉用这个函数
    // 防抖的核心所在
    function timerExpired() {
      var time = now();
      // 如果符合调用函数的时间，就触发trailingEdge函数
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // 不满足时间的话，需要重新计算需要等待的时间，然后再重新调用自己
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    //  执行用户传入的函数
    function trailingEdge(time) {
      timerId = undefined;
      // 如前面如果存在lastArgs代表已经至少执行过一次debounce
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    //  取消防抖
    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    //  立即执行用户传入的函数
    function flush() {
      return timerId === undefined ? result : trailingEdge(now());
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
          // 如果设置了最大等待时间，则立即执行用户传入的函数
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

// 再lodash中节流的原理和防抖一样，只是触发条件不同，节流其实就是maxWait为wait的防抖
function throttle(func, wait, options) {
  var leading = true;
      trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
