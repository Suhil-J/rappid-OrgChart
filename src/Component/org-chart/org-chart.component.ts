import { OnInit, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { dia, ui, shapes, layout } from '@clientio/rappid';
import { OrgChartService } from 'src/Service/org-chart.service';
import '../../assets/shapes'

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;

  constructor(private orgChartService: OrgChartService,) { }

  LoadGraphItems() {
    this.orgChartService.LoadGraphItems().subscribe(data => {
      this.GenerateOrgChart(data);
    }
    );
  }

  ngOnInit(): void {
    this.LoadGraphItems();
  };

  GenerateOrgChart(chartData: any) {

    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
      el: document.getElementById('paper')!,
      model: graph,
      width: 680,
      height: 600,
      gridSize: 20,
      interactive: true,
      async: true,
      frozen: false,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: '#F3F7F6' },
      cellViewNamespace: shapes
    });

    const scroller = this.scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab'
    });
    scroller.render().centerContent({ useModelGeometry: true });

    this.graph.fromJSON(chartData)

    const treeLayout = new layout.TreeLayout({
      graph: graph,
      direction: 'R',
      parentGap: 75,
      siblingGap: 41
    });
    new ui.TreeLayoutView({
      paper,
      model: treeLayout,
      className: 'tree-layout member-tree-layout',
      useModelGeometry: true,
      clone: (element: dia.Element) => {
        const clone = element.clone() as dia.Element;
        clone.attr(['memberAddButtonBody', 'display'], 'none');
        clone.attr(['memberRemoveButtonBody', 'display'], 'none');
        clone.attr(['body', 'stroke'], 'none');
        return clone;
      },
      previewAttrs: {
        parent: {
          rx: 40,
          ry: 40
        }
      }
    });
    treeLayout.layout();
    paper.unfreeze();

    paper.on('element:member:add', (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      // Adding a new member
      const newMember = this.member('Employee', 'New Employee', 'assets/images/1.png');
      const newConnection = this.link(elementView.model, newMember);
      graph.addCells([newMember, newConnection]);
      treeLayout.layout();
    });

    paper.on('element:remove', (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      // A member removal
      elementView.model.remove();
      treeLayout.layout();
    });

    paper.on('element:edit', (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      // A member edit
      const inspector = new ui.Inspector({
        cellView: elementView,
        theme: 'default',
        inputs: {
          'attrs/label/text': {
            type: 'text',
            label: 'Name',
            index: 1
          },
          'attrs/description/text': {
            type: 'text',
            label: 'Rank',
            index: 2
          },
          'attrs/icon/xlinkHref': {
            type: 'select-button-group',
            target: '.joint-dialog .fg',
            label: 'Avatar',
            index: 3,
            options: this.avatarOptions(elementView)
          }
        }
      });
      inspector.render();
      inspector.el.style.position = 'relative';

      const dialog = new ui.Dialog({
        type: 'inspector-dialog',
        width: 350,
        title: 'Edit Member',
        className: 'joint-dialog joint-member-dialog',
        closeButton: false,
        content: inspector.el,
        buttons: [{
          content: 'Cancel',
          action: 'cancel',
        }, {
          content: 'Apply',
          action: 'apply'
        }]
      });

      dialog.on({
        'action:cancel': () => {
          inspector.remove();
          dialog.close();
        },
        'action:apply': () => {
          inspector.updateCell();
          inspector.remove();
          dialog.close();
        }
      });
      dialog.open();
    });

    this.canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    paper.unfreeze();

  }

  member = (rank: string, name: string, image: string): shapes.app.Member => {
    return new shapes.app.Member({
      attrs: {
        label: {
          text: name
        },
        description: {
          text: rank
        },
        icon: {
          xlinkHref: image
        }
      }
    });

  };

  link = (source: dia.Element, target: dia.Element): shapes.app.Link => {
    return new shapes.app.Link({
      source: { id: source.id },
      target: { id: target.id },
    });
  };

  avatarOptions = (elementView: dia.ElementView): { value: string, icon: string, selected: boolean }[] => {
    const options = [];
    const ASSETS_LENGTH = 10;
    for (let i = 0; i++, i <= ASSETS_LENGTH;) {
      const asset = `assets/images/${i}.png`;
      const option = {
        icon: asset,
        value: asset,
        selected: elementView.model.attr(['icon', 'xlinkHref']) === asset
      };
      options.push(option);
    }
    return options;

  }
}

