import { Tree } from 'antd';
import styles from './index.module.sass'

import type { DataNode } from 'antd/es/tree';

const treeData: DataNode[] = [
  {
    title: '视频资源',
    key: '0-0',
    children: [
      { title: '宣传片', key: '0-0-0' },
      { title: '宣传音乐', key: '0-0-1' },
    ],
  },
  {
    title: '游戏资源 (单机4A大作)',
    key: '0-1',
    children: [
      { title: '穿越火线', key: '0-1-0' },
      { 
        title: '使命召唤OL系列', 
        key: '0-1-1' ,
        children:[
          { title: '穿越火线穿越火线穿越火线穿越火线穿越火线穿越火线', key: '0-1-0-1' },
          { title: '穿越火线', key: '0-1-0-2' }
        ]
      },
    ],
  },
  {
    title: '仙剑奇侠传系列"',
    key: '0-0-9-1',
  },
  {
    title: '封神榜',
    key: '0-0-9-2',
  },
  {
    title: '轩辕剑系列',
    key: '0-0-9-3',
  },
  {
    title: '三国演义系列',
    key: '0-0-9-4',
  },
  {
    title: '文明系列',
    key: '0-0-9-5',
  },
  {
    title: '宝可梦系列',
    key: '0-0-9-6',
  },
  {
    title: '真三国无双系列',
    key: '0-0-9-7',
  },
  {
    title: '模拟人生系列',
    key: '0-0-9-8',
  },
  {
    title: '古剑奇谭系列',
    key: '0-0-9-9',
  },
  {
    title: '封印者',
    key: '0-0-9-91',
  },
  {
    title: '大话西游系列',
    key: '0-0-9-92',
  },
  {
    title: '剑侠情缘系列',
    key: '0-0-9-93',
  },
  {
    title: '明星志愿系列',
    key: '0-0-9-94',
  },
  {
    title: '武侠义',
    key: '0-0-9-95',
  },
  {
    title: '问道',
    key: '0-0-9-96',
  },
  {
    title: '轩辕剑外传：枫之舞',
    key: '0-0-9-97',
  },
  {
    title: '征途系列',
    key: '0-0-9-98',
  },
  {
    title: '笑傲江湖系列',
    key: '0-0-9-99',
  },
  {
    title: '仙剑奇侠传五前传',
    key: '0-0-9-991',
  },
  {
    title: '古剑奇谭三',
    key: '0-0-9-992',
  },
];


const FolderTree = () => {
  return (
    <div
      className={styles.folder}
    >
      <Tree.DirectoryTree
        multiple
        blockNode
        treeData={treeData}
        onSelect={e => console.log(e)
        }
      />
    </div>
  );
};

export default FolderTree;
