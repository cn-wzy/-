/*
Promise对象存在三种状态
    pending（等待状态）
    fulfilled（成功)
    rejected（失败）
*/

// 标记Promise对象的三种状态
const PENDING = "PENGING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

// 定义MyPromise
class MyPromise {
  constructor(handler) {
    if (!isFunction(handler)) {
      throw new Error("promise必须接受一个函数作为参数");
    }
    this._status = PENDING;
    this._value = undefined;
    // 添加两个队列，分别来存储回调成功的函数和回调失败的函数
    this._fulfilledQueues = [];
    this._rejectedQUeues = [];

    try {
      // 绑定上下文
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }
  // 修改了支持当传入resolve的参数是一个Promise对象的时候
  _resolve(val) {
    const run = () => {
      if (this._status !== PENDING) return;
      const runFulfilled = () => {
        this._status = FULFILLED;
        this._value = val;
        let cb;
        while ((cb = this._fulfilledQueues.shift())) {
          cb(val);
        }
      };
      const runRejected = (error) => {
        let cb;
        while ((cb = this._rejectedQUeues.shift())) {
          cb(error);
        }
      };
      /*
        如果当前resolve参数是一个Promise对象， 则必须等待Promise对象状态改变，
        当前的Promise状态才会改变，且状态取决Promise的状态
    */
      if (val instanceof MyPromise) {
        val.then(
          (value) => {
            this._value = value;
            runFulfilled(value);
          },
          (error) => {
            this._value = error;
            runRejected(error);
          }
        );
      } else {
        this._value = val;
        runFulfilled(val);
      }
    };
    // 为了支持同步的promise，这里使用异步调用
    setTimeout(() => run(), 0);
  }
  _reject(error) {
    if (this._status !== PENDING) return;
    const run = () => {
      this._status = REJECTED;
      this._value = error;
      let cb;
      while ((cb = this._rejectedQUeues.shift())) {
        cb(error);
      }
    };

    setTimeout(run, 0);
  }
  // then方法的实现
  then(onFulfilled, onRejected) {
    const { _status, _value } = this;
    // then方法返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      let fulfilled = (value) => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            let res = onFulfilled(value);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onRejectedNext(res);
            }
          }
        } catch (error) {
          onRejectedNext(error);
        }
      };
      let rejected = (error) => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error);
          } else {
            let res = onRejected(error);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (error) {
          onRejectedNext(error);
        }
      };
      switch (_status) {
        case PENDING:
          this._fulfilledQueues.push(onFulfilled);
          this._rejectedQUeues.push(onRejected);
          break;
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
      }
    });
  }

  // catch的实现，相当于then方法，但是只传入Rejected的回调函数
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // all方法的实现
  static all(list) {
    return new Promise((resolve, reject) => {
      let values = [];
      let count = 0;
      for (let [i, p] in list.entries()) {
        this.resolve(p).then(
          (res) => {
            values[i] = res;
            count++;
            if (count === list.length) resolve(values);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  // race方法
  static race(list) {
    return new Promise((resolve, reject) => {
      for (let p in list) {
        this.resolve(p).then(
          (res) => resolve(res),
          (error) => reject(error)
        );
      }
    });
  }

  // finally方法
  finally(cb) {
    return this.then(
      (value) => MyPromise.resolve(cb()).then(() => value),
      (reason) =>
        MyPromise.reject(cb()).then(() => {
          throw reason;
        })
    );
  }
}
