import { message } from "ant-design-vue";
import axios, { AxiosError } from "axios";

const templateSchema = {
  componentName: "div",
  props: {},
  children: [
    {
      componentName: "Image",
      props: {
        src: "",
        width: "100",
        height: "120",
      },
      id: "807ad027-32b7-44b0-a8c8-3cbac5c85d77",
      label: "图片",
      icon: "icon-image",
    },
    {
      componentName: "Text",
      props: {
        type: "inline",
        content:
          '<span style="font-weight: bolder; text-align: center;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 何通洋&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<br></span><span style="font-size: small; text-align: center;">&nbsp;</span><span style="font-weight: 700; text-align: center;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="font-size: small; text-align: center;">电话:xxxxxxxxxxx | 2365539910@qq.com<br></span><span style="font-weight: 700; text-align: center;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span style="font-size: small; text-align: center;">前端开发工程师<br></span>',
      },
      id: "d5318fc2-0fd4-4eb6-a51f-660de594a273",
      label: "行内文本",
      icon: "icon-text",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content: '<b><font size="4">教育经历</font></b>',
      },
      id: "2ac35f8b-3182-43f9-bf15-0bba4b21d731",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Horizon",
      props: {},
      id: "d9073895-ed1a-4d47-928e-a78d68aceba0",
      label: "分割线",
      icon: "icon-horizon",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content:
          '<b>中国矿业大学&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </b><font size="2" color="#909399">2021年09月-2025年09月</font><div><div data-node="true"><font size="2">大数据专业 本科 计算机科学与技术学院&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <font color="#909298">江苏徐州</font></font></div><div data-node="true"><font size="2">—阿里巴巴-蚂蚁集团 开源团队 AntV、Umi 团队成员、Ant Design Collaborator</font></div><div data-node="true"><font size="2">—若干知名开源项目代码贡献:蚂蚁 AntDesign、Umi、G2、S2、G6VP 等、腾讯 Omi Design、阿里 ahooks、Element Plus、字 节 byted-hook、web doctor等</font></div><div data-node="true"><font size="2">---2022腾讯犀牛鸟开源人才计划--OMI贡献排行 第三(证书)</font></div></div><div data-node="true"><font size="2"><br></font></div>',
      },
      id: "c2c7e9bf-7f8f-49c1-8621-657fe91d1aca",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content: '<b><font size="4">专业能力</font></b>',
      },
      id: "e4070ae6-082d-4e06-a2e2-641fedd7dc2b",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Horizon",
      props: {},
      id: "f1828d7d-0051-458a-a9a5-e23989f9706e",
      label: "分割线",
      icon: "icon-horizon",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content:
          '<div data-node="true"><font size="2">·熟悉HTML5,CSS3,ES6，了解常用网络协议、数据结构，熟悉Chromium架构</font></div><div data-node="true"><font size="2">·熟练使用Vue2、Vue3全家桶开发，能使用React开发，对Vue源码以及架构有较深的理解</font></div><div data-node="true"><font size="2">·能使用服务端框架 Nestjs+Sequelize(Mysql) 或 Serverless 进行全栈开发，熟悉服务端渲染(SSR)方案</font></div><div data-node="true"><font size="2">·熟悉 Vite、Webpack、Rollup、Gulp，熟悉 Monorepo 开发、手写 Qiankun 核心API、熟悉 CICD 等工程化方案</font></div><div data-node="true"><font size="2">·开源实践丰富、前沿技术共建活跃经验、参与业界多种知名开源项目、前端技术选型经验丰富</font></div><div data-node="true"><font size="2">·业务经验丰富，大厂业务类型经验包括但不限于 广告(百度)、基础架构(蚂蚁支付宝、字节) - 企业级前端框架</font></div><div data-node="true"><font size="2">·设计研发 umi endex、可视化 低代码(蚂蚁 Antv)、非中国区业务 商业化(字节 TikTok、Capcut)、云计算 apaas sass(腾讯 混沌工程)、组件库(蚂蚁 Ant Design 有效pr 30+、v5 SSR 方案参与设计)</font></div><div data-node="true"><font size="2"><br></font></div><div data-node="true"></div>',
      },
      id: "a5227e35-59c3-4594-a100-0b190dfd8f3d",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content: '<b><font size="4">工作经历</font></b>',
      },
      id: "ee31a916-3e48-4263-8ea6-b1ee60a5a435",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Horizon",
      props: {},
      id: "2b41a408-a3e7-4b5e-a183-48ef9b5fb3b3",
      label: "分割线",
      icon: "icon-horizon",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content:
          '<div data-node="true"><strong>腾讯集团</strong> <font size="2"><strong>混沌工程前端团队</strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<font color="#95979d">2023年07月初-至今</font></font></div><div data-node="true"><font size="2">关键词:混沌工程 apaas sass&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <font color="#9a9ca2">深圳</font></font></div><div data-node="true"><font size="2">·主要负责腾讯云官网 公有云混沌工程 业务和 内部私有云混沌 的平台开发，该业务旨在为软件开发全流程提供</font><span style="font-size: small;">混沌演练、混沌报告、稳定性分析、故障插件系统等多种能力</span></div><div data-node="true"><font size="2">·工作闲余为腾讯 Oteam Infra 团队贡献相关代码 </font></div><div data-node="true"><font size="2">·工作内容包括:</font></div><div data-node="true"><font size="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;内部私有云混沌相关业务的需求评审、技术方案调研、设计等，包括但不限于大客户需求、灰度执行动作组需</font></div><div data-node="true"><font size="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;求、年度演练报告需求、低代码可视化生成报表需求等</font></div><div data-node="true"><font size="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;外部公有云相关业务需求，负责腾讯云混沌工程相关业务需求</font></div><div data-node="true"><font size="2">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;输出 开源仓库 - 前端业务开发指南 作为 团队协同开发和前端工程师代码质量规范</font></div><div data-node="true"><font size="2"><br></font></div>',
      },
      id: "40471b25-4a9c-45ae-ba0a-ebfee2fcc632",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content: '<b><font size="4">开源项目</font></b>',
      },
      id: "de74514f-da45-476d-97ec-78de994a3a2a",
      label: "单行文本",
      icon: "icon-text",
    },
    {
      componentName: "Horizon",
      props: {},
      id: "a1538793-022d-4b80-a357-a274a2515a5f",
      label: "分割线",
      icon: "icon-horizon",
    },
    {
      componentName: "Text",
      props: {
        type: "block",
        content:
          '<div data-node="true"><font size="2"><strong>mini-umi 《从0到1手写可插拔前端框架》小册&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong>Github Stars:190+</font></div><div data-node="true"><font size="2">项目简介:实现微内核架构 Service Core 的最简模型(详情请见 README )                                                 开源仓库链接</font></div><div data-node="true"><font size="2">提供内置的 Presets Plugins 能力，自由扩展、可插拔的系统</font></div><div data-node="true"><font size="2">提供完整的插件 API 系统链路，提供 Umi4.x 的 加入读取用户本地 Local Plugin 特性</font></div><div data-node="true"><font size="2">实现 mini-umi 的 commands 系统，实现编译时 生命周期 Hooks</font></div><div data-node="true"><font size="2">实现 create-mumi 脚手架</font></div><div data-node="true"><font size="2">实现 userConfig 以及 modify 全流程</font></div><div data-node="true"><font size="2">实现 Preset-Vue3.2 + Vite + dev build preview</font></div><div data-node="true"><font size="2">实现约定式路由 支持动态路由 Vite 支持 Vue3.2 Hmr，支持用户配置文件自定义路由 和 更改约定式路由所在目录</font></div><div data-node="true"><font size="2">支持对于 dev 约定式路由 的热更新</font></div><div data-node="true"><font size="2">可通过 npm run ssr 开启服务端渲染模式</font></div><div data-node="true"><font size="2">双模式 CSR SSR 支持用户自定义 Layout</font></div>',
      },
      id: "0be8ec38-c74a-49aa-9266-8d6fc1b4e204",
      label: "单行文本",
      icon: "icon-text",
    },
  ],
  id: "518adc1b-224e-4b9d-abba-f6d3b349b369",
};

/**
 * 将长字符串分割成不超过指定长度的片段
 * @param str 要分割的字符串
 * @param maxLength 每个片段的最大长度
 * @returns 分割后的字符串数组
 */
export const splitString = (str: string, maxLength: number): string[] => {
  const result: string[] = [];
  let currentIndex = 0;

  while (currentIndex < str.length) {
    const endIndex = currentIndex + maxLength;
    result.push(str.substring(currentIndex, endIndex));
    currentIndex = endIndex;
  }

  return result;
};

const config = {
  API_KEY: "0d3a908d77bd48088b41cd5953bfda64.R4QBVVEjq7HVc2DO",
  model: "glm-4.5-flash",
  messages: [
    {
      role: "system",
      content: `
      1.你是擅长简历分析和优化的专家并且熟悉Vue，
      2.你可能会得到一个pageSchema的JSON字符串，这是简历的完整体现。
      3.你首先得分析其JSON结构，然后在此基础上进行修改和优化。
      4.最终以JSON字符串的格式返回。
      如果没有的话，可以阅读示例：${JSON.stringify(templateSchema)}
      `,
    },
    {
      role: "user",
      content:
        "你可能会得到一段段不完整的pageSchema字符串，你需要先拼接。最终结果只需要JSON，不要有任何其他内容",
    },
  ],
  response_format: {
    type: "json_object",
  },
};

/** AI对话 */
export async function AIChat(user_message: string) {
  if (!user_message) return Promise.reject("对话内容为空");

  const messages = [
    ...config.messages,
    {
      role: "user",
      content: user_message,
    },
  ];

  try {
    const res = await axios.post(
      "/ai/paas/v4/chat/completions",
      {
        model: config.model,
        messages: messages,
      },
      {
        headers: {
          Authorization: "Bearer " + config.API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    const { choices = [] } = res.data;
    return Promise.resolve(choices[0].message.content);
  } catch (err: any) {
    const msg = err?.response?.data?.error?.message;
    message.error(msg);
    return Promise.reject(msg);
  }
}
