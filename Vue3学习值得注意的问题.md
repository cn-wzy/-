## Vue3中数据绑定为什么使用Proxy，怎么实现
    对象的增添删除都可以实现响应式
    数组通过下标的修改也可以是响应式
    使用Proxy时实现响应式转换，是懒执行的，把对象传给Vue2的响应式的时候，必须遍历所有key，并且当场转换，在使用vue3，调用reactive，返回proxy代理对象，并且只会在需要的时候才去转换嵌套对象，像“懒加载”，可以节省很多时间
    Proxy中有参数handler，使用handler中可以写set、get、deleteProperty进行数据拦截，剩下同Vue2？

## Vue3中为什么Proxy中数据使用Reflect对象
    ECMAScript6中的新API
    将Object对象一些明显属于语言内部地方放到Reflect对象上
    Object.defineProperty无法定义属性的时候会抛出错误，而Reflect上则只会返回false、
    某些Object操作是命令式，如delete，但在Reflect中是函数式

    *Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy方法就能在Reflect对象上找到对应方法，也就是说，不管Proxy怎么修改默认行为，总可以在Reflect上获取默认行为（原因）
    *Proxy中使用Reflcet可以添加一个额外参数，被传递到Reflect调用中，能确保我们的对象继承其他对象的值的时候，this能正确指向调用对象，我们希望方法都绑定到Proxy，而不是target上


## watch监听reactive定义的对象时newValue和oldValue相同
    只要监听的是proxy代理对象，就会导致这个现象
    监视reative定义的整个数据自动开启深度监听，deep配置无效
    官方解释：在变更对象和数组时，旧值和新值相同，因为他们的引用指向同一个对象、数组。Vue不会保留变更之前的副本
    如果需要监听改变函数里面的旧值，只能监听对象.xxx属性的方式，并且源对象要写成()=>xxx.属性的方式

## Vue3与Vue2生命周期的区别
    beforeDestory与Destroyed变成beforeUnmount与Unmounted
    判断是否有‘el’option或者是否调用mount(el)从Created之后提前到整个初始化的前面

    Vue3提供了组合式API的生命周期钩子
    setup()相当于beforeCreate和Created，其他在前面加on比如onBeforeMount

## Composition API的优势
    传统OptionsAPI中，新增或者修改一个需求，就需要在data，methods，computed修改
    Composition API可以使我们更加优雅的组织我们的代码，函数，让相关的功能更加有序的组织在一起

## Fragment
    Vue2中组件必须要有一个根标签
    组件可以没有根标签，内部会将多个标签包含在一个Fragment虚拟元素中
    好处：减少标签层级，减小内存占用

## defineAsyncComponent
    异步引入
    const Child = defineAsyncComponent(() => import ('./components/Child'))
    可以优化首屏加载时间
    可能会出现界面抖动

    可以使用 <Suspense>
                <template v-slot:default>
                    <Child/>
                </template>
            </Suspense>
            <Suspense>
                <template v-slot:fallback>
                    <h3>加载中，请稍后</h3>
                </template>
            </Suspense>

    有Suspense可以setup中返回一个promise

## vuex为什么要通过mutations修改state，而不能直接修改
    state是异步更新的，mutations无法进行异步操作，如果直接修改state是可以异步操作的，如果异步操作时，还没执行完，state又在其他地方修改了，会导致出现问题
    通过mutation修改state，vue调试工具会记录下来，方便调试
    vuex是跨组件交互，拆分为基于状态管理的处理，这样项目代码会更加直观更加利于维护

