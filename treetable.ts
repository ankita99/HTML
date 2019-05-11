import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Injectable, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable } from 'rxjs';

const LOAD_MORE = 'LOAD_MORE';

/** Nested node */
export class LoadmoreNode {
    childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

    get children(): LoadmoreNode[] {
        return this.childrenChange.value;
    }

    constructor(public item: string,
        public hasChildren = false,
        public loadMoreParentItem: string | null = null) { }
}

/** Flat node with expandable and level information */
export class LoadmoreFlatNode {
    constructor(public item: string,
        public level = 1,
        public expandable = false,
        public loadMoreParentItem: string | null = null) { }
}

/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable()
export class LoadmoreDatabase {
    batchNumber = 5;
    dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
    nodeMap = new Map<string, LoadmoreNode>();

    /** The data */
    rootLevelNodes: string[] = ['SizzlerDeal'];
    dataMap = new Map<string, string[]>([
        ['SizzlerDeal', ['Component Group1', 'Component Group2', 'Component Group3']],
        ['Component Group3', ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']]
    ]);

    //   rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
    //   dataMap = new Map<string, string[]>([
    //     ['Fruits', ['Apple', 'Orange', 'Banana']],
    //     ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    //     ['Apple', ['Fuji', 'Macintosh']],
    //     ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
    //   ]);

    initialize() {
        const data = this.rootLevelNodes.map(name => this._generateNode(name));
        this.dataChange.next(data);
    }

    /** Expand a node whose children are not loaded */
    loadMore(item: string, onlyFirstTime = false) {
        if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
            return;
        }
        const parent = this.nodeMap.get(item)!;
        const children = this.dataMap.get(item)!;
        if (onlyFirstTime && parent.children!.length > 0) {
            return;
        }
        const newChildrenNumber = parent.children!.length + this.batchNumber;
        const nodes = children.slice(0, newChildrenNumber)
            .map(name => this._generateNode(name));
        if (newChildrenNumber < children.length) {
            // Need a new load more node
            nodes.push(new LoadmoreNode(LOAD_MORE, false, item));
        }

        parent.childrenChange.next(nodes);
        this.dataChange.next(this.dataChange.value);
    }

    private _generateNode(item: string): LoadmoreNode {
        if (this.nodeMap.has(item)) {
            return this.nodeMap.get(item)!;
        }
        const result = new LoadmoreNode(item, this.dataMap.has(item));
        this.nodeMap.set(item, result);
        return result;
    }
}
@Component({
    selector: 'app-portfolio-treeview',
    templateUrl: './portfolio-treeview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./portfolio-treeview.component.scss'],
    providers: [LoadmoreDatabase]
})
export class PortfolioTreeviewComponent implements OnInit {

    nodeMap = new Map<string, LoadmoreFlatNode>();
    treeControl: FlatTreeControl<LoadmoreFlatNode>;
    treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
    // Flat tree data source
    dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;
    
    mockData = {
        data: {
            name: "",
            id: "",
            status: "",
            version: "",
            level: 0
        },
        children: []
    };

    // test1 : mockTree;
treeviewdata: any;
testData: any;
    test1= {
        data: {
            name: "",
            id: "",
            status: "",
            version: "",
            level: 0
        },
        children: []
    };

    data = [
        {
            "data": {
                "name": "Andrew",
                "gender": "Male",
                "id": 1,
                "status": "Active"
            },
            "children": [
                {
                    "data": {
                        "name": "Andrewson",
                        "gender": "Male",
                        "id": 1,
                        "status": "Active"
                    },
                    "children": [
                        {
                            "data": {
                                "name": "Eric",
                                "gender": "Male",
                                "id": 1,
                                "status": "Active"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    result : any;
    mockTree: any;
testData1: any;
    constructor(private database: LoadmoreDatabase, private ref: ChangeDetectorRef) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);

        this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(this.getLevel, this.isExpandable);

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.result =[];
        this.mockTree = [];

        database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });

        database.initialize();
    }
    ngOnInit() {
this.testData1 = {
    "responseId": "e25608fb-1d0c-b6c0-0008-016a43e38cec",
    "portfolioItem": [
      {
        "id": "DataPlans1",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0",
        "childPortfolioItem" :[
        {
        "id": "DataPlanschild1",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0",
        "childPortfolioItem" :[
        {
        "id": "DataPlanschild22",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0"
        },
        {
        "id": "DataPlanschild23",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0"
        }
        ]
        },
         {
        "id": "DataPlanschild2",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0"
        }
        ]
      }
    ]
  };

  this.testData = {
    "responseId": "e25608fb-1d0c-b6c0-0008-016a43e38cec",
    "portfolioItem": [
      {
        "id": "DataPlans1",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0",
        "childPortfolioItem" :[
        {
        "id": "DataPlanschild1",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0"
        },
         {
        "id": "DataPlanschild2",
        "name": "Data Plans",
        "status": "Aborted",
        "version": "1.0",
        "childPortfolioItem" :[
            {
            "id": "DataPlanschild154655",
            "name": "Data Plans",
            "status": "Aborted",
            "version": "1.0"
            },
             {
            "id": "DataPlanschild26436346",
            "name": "Data Plans",
            "status": "Aborted",
            "version": "1.0"
            }
            ]
          
        }
        ]
      }
    ]
  };
  this.buildTree(this.testData,0);
 this.recursionTest(this.testData.portfolioItem, 0);

 console.log("FINAL TREEE",JSON.stringify(this.mockTree));
 this.ref.detectChanges();

    }

    ngAfterViewInit() {
  }ss

    getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> => node.childrenChange;

    transformer = (node: LoadmoreNode, level: number) => {
        const existingNode = this.nodeMap.get(node.item);

        if (existingNode) {
            return existingNode;
        }

        const newNode =
            new LoadmoreFlatNode(node.item, level, node.hasChildren, node.loadMoreParentItem);
        this.nodeMap.set(node.item, newNode);
        return newNode;
    }

    public recursionTest(treedata: any,level: any){
        if (typeof treedata !== 'undefined') {

            for(let i=0; i<treedata.length; i++) {
                
                let arrdata1 = {
                    data: {},
                    children: []
                }
                if (typeof treedata[i].childPortfolioItem !== 'undefined') {
                    
                  if (treedata[i].childPortfolioItem.length > 0 ) {

                        for(var key in treedata[i]){
                            if(key !== 'childPortfolioItem'){
                                arrdata1.data[key] = treedata[i][key];
                               
                            }
                        }
                         let childList= treedata[i].childPortfolioItem;
                         this.recursionTest(treedata[i].childPortfolioItem, level + 1);
                        for(var k =0 ; k<childList.length; k++){
                            let arrdata: any;
                            if(level>0){
                             arrdata = {
                                    data: childList[k]
                                };
                            }
                            else{
                                if(typeof childList[k].children !=='undefined'){
                                    arrdata = childList[k];
                                }
                                else{
                                    arrdata = {
                                        data: childList[k]
                                    };
                                }
                            }
                            arrdata1.children.push(arrdata);
                            //result1.push(arrdata1);
                            this.recursionTest(treedata[i].childPortfolioItem, level + 1);
                        }
                        treedata[i]= arrdata1;
                        this.mockTree = [];
                        this.mockTree.push(treedata[i]);
                        //console.log("treedata[i]**************",JSON.stringify(treedata[i]));
                    }          
                    }
              }
          }
    }

    buildTree(treedata: any, level: any) {
        var tree1: any;
        for (var key in treedata) {
            if (typeof treedata[key] === 'object') {
                for (var j = 0; j <= treedata[key].length; j++) {
                    tree1 = treedata[key][j];
                    let test4= {
                        data: {
                            name: "",
                            id: "",
                            status: "",
                            version: "",
                            level: 0
                        },
                        children: []
                    };

                    let test6= {
                        data: {
                            name: "",
                            id: "",
                            status: "",
                            version: "",
                            level: 0
                        }
                    };
                    for (var i in tree1)
                    {
                        if (i !== "childPortfolioItem" && level ==0) {
                            this.test1.data[i] = tree1[i];
                        }
                        else if(i !== "childPortfolioItem" && level >0){
                            test4.data[i] = tree1[i];
                        }
                        if(i == "childPortfolioItem" && level >0)
                        {
                            this.buildTree(tree1[i], level + 1);
                            for(var n=0;n<tree1[i].length; n++){
                                test6.data = tree1[i][n];
                                test4.children.push(test6);
                            }
                            //test4.children = tree1[i];
                            this.test1.children.push(test4);
                        }
                        if (i == "childPortfolioItem") {
                            let child = [];
                            child.push(tree1[i]);
                            this.buildTree(child, level + 1);
                        }
                    }
                }
            }
        }
    }

    getLevel = (node: LoadmoreFlatNode) => node.level;

    isExpandable = (node: LoadmoreFlatNode) => node.expandable;

    hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;

    isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.item === LOAD_MORE;

    /** Load more nodes from data source */
    loadMore(item: string) {
        this.database.loadMore(item);
    }

    loadChildren(node: LoadmoreFlatNode) {
        this.database.loadMore(node.item, true);
    }

    array(n: number): any[] {
        return Array(n);
    }

}
