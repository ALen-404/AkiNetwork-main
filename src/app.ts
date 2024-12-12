import type {RequestConfig} from 'umi';

export const request: RequestConfig = {
  timeout: 10000,
  // other axios options you want
  errorConfig: {  // =======统一的错误处理方案=======
    errorHandler() {
    },
    errorThrower() {
    }
  },
  requestInterceptors: [  // =======为request方法添加请求阶段的拦截器=======
    // 直接写一个 function，作为拦截器
    (url, options) => {
      // do something
      return {url: url, options}
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(url, options) => {
      return {url, options}
    }, (error: any) => {
      return Promise.reject(error)
    }],
    // 数组，省略错误处理
    [(url, options) => {
      return {url, options}
    }]
  ],
  responseInterceptors: [ // =======为request方法添加响应阶段的拦截器=======
    // 直接写一个 function，作为拦截器
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      const {data = {} as any, config} = (response || {});
      // do something
      return data
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [(response) => {
      return response
    }, (error: any) => {
      return Promise.reject(error)
    }],
    // 数组，省略错误处理
    [(response) => {
      return response
    }]
  ]
};
