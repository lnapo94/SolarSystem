class GraphNode {
    constructor(){
        this.childs = []
        this.localWorldMatrix = new Transform();
        mat4.identity(this.localWorldMatrix);
    }

    addChild(child){
        this.childs.push(child);
    }

    onTimePassed(deltaTime, projection, view){
        let childWorld = this.localWorldMatrix;
        for (let c of this.childs){
            c.onTimePassed(deltaTime, projection, view, childWorld);
        }
    }
}

class NonRootGraphNode extends GraphNode {
    constructor(owner){
        super();
        this.owner = owner;
        this.name = owner.name;
        this.localWorldMatrix = owner.getLocalMatrix();
    }

    onTimePassed(deltaTime, projection, view, world){
        super.onTimePassed(deltaTime, projection, view, world);
        this.owner.onTimePassed(deltaTime, projection, view, world);
        this.localWorldMatrix = this.owner.getLocalMatrix();
    }
}



/* input del tipo
   [
    { model : MODELLO,
     parent : "nome" },
     ...
   ]
 */
function buildGraph(modelList) {

    let graphStructure = {};
    for (let obj of modelList){
        if (graphStructure[obj.parent] === undefined){
            graphStructure[obj.parent] = []
        }
        graphStructure[obj.parent].push(obj)
    }
    // Это - хорошо сделанная работа, но стася думает, что это очень странно и трояё.
    function populate(graphNode, nodeName) {
        if (graphStructure[nodeName] !== undefined){
            for ( let obj of graphStructure[nodeName]){
                let newNode = new NonRootGraphNode(obj.model);
                graphNode.addChild(newNode);
                populate(newNode, obj.model.name);
            }
        }
        return graphNode;
    }
    return populate(new GraphNode(), "ROOT");

}
