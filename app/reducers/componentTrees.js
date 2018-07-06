import produce from "immer";
import _ from "lodash";
import {findNode} from "../utils/index";


const nodesTree = {
  nodes: {
    type: 'Block',
    id: 100000,
    props: {
      name: {
        type: 'string',
        value: 'root'
      }
    },
    children: []
    // type: 'grid',
    // id: 100000,
    // props: {
    //   row: {
    //     type: 'number',
    //     value: '4'
    //   },
    //   col: {
    //     type: 'number',
    //     value: '4'
    //   }
    // },
    // children: [
    //   {
    //     type: 'button',
    //     id: '1234',
    //     cid: 'c00',
    //     props: {}
    //   },
      // {
      //   type: '',
      //   id: '',
      //   props: {},
      //   children: []
      // }
    // ]
  },
  editNodeId: 0
};

export default function componentTrees(state = nodesTree, action) {
  return produce(state, (draft)=>{
    let data = null;
    let node = null;
    switch (action.type) {
      case "add":
        const nodes = draft.nodes;
        const parentId = action.item.parent || 100000;
        const parentNode = findNode(nodes, parentId);
        parentNode.children = parentNode.children || [];
        parentNode.children.push(action.item);
        break;

      case "settings":
        data = action.data;
        const nodeId = data.id;
        draft.editNodeId = nodeId;
        break;

      case "updateNode":
        data = action.data;
        const {id, props} = data;
        node = findNode(draft.nodes, id);
        _.each(props, (v, k)=>{
          node.props[k] = node.props[k] || {};
          node.props[k].value = v;
        });
    }
  })
}
