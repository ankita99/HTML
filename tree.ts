import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Injectable, ViewChild,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { PortfolioService } from 'src/app/shared/services/portfolio/portfolio.service';
import { Portfolio, PortfolioItem, FileNode, PortfolioTree, FileFlatNode, mockTree } from 'src/app/shared/classes/portfolio';

@Component({
    selector: 'app-portfolio-treeview',
    templateUrl: './portfolio-treeview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./portfolio-treeview.component.scss']
})
export class PortfolioTreeviewComponent implements OnInit {
    isExpand: boolean = false;

    treeControl: FlatTreeControl<FileFlatNode>;

    treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

    dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

    portfolioItem: PortfolioItem;

    state: boolean;
    portfolioId: string;
    testData: any;
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
    constructor( private portfolioService: PortfolioService, private ref: ChangeDetectorRef) {
        this.portfolioId = this.portfolioService.getPortfolioId();
    }


    ngOnInit() {
        this.isExpand = true;
        this.getPortfolioTreeById(this.portfolioId, false);
    }

    ngAfterViewInit() {
        this.isExpand = true;
    }
    checkState(a) {
        if (a.index == 1) {
            this.state = true;
        }
        else {
            this.state = false;
        }
        this.getPortfolioTreeById(this.portfolioId, this.state);
    }

    getPortfolioTreeById(portfolioId: string, state: boolean) {
        this.portfolioService.getPortfolioTree(portfolioId, state).subscribe((data: any) => {
            this.testData = data;
            this.treeviewdata =[];
            this.buildTree(this.testData, 0);
            console.log("TESTDATA>>>>>>>", JSON.stringify(this.test1));
            this.treeviewdata.push(this.test1);
             this.ref.detectChanges();
        });
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

    check() {
        if (this.isExpand) {
            this.isExpand = !this.isExpand;
        }
        else {
            this.isExpand = !this.isExpand;
        }
    }
}
