function loadMeshData(str) {
    var objects = str.split("o ");
    res = []
    for (ob in objects){
        res.push(new OBJ.Mesh(ob));
    }
    return res
}
