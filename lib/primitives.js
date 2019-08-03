let Primitives = {};

Primitives.Cube = class {
    static createMesh(gl,width,height,depth,x,y,z){
        var w = width*0.5, h = height*0.5, d = depth*0.5;
        var x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d;

        //Starting bottom left corner, then working counter clockwise to create the front face.
        //Backface is the first face but in reverse (3,2,1,0)
        //keep each quad face built the same way to make index and uv easier to assign
        var aVert = [
            x0, y1, z1, 0,	//0 Front
            x0, y0, z1, 0,	//1
            x1, y0, z1, 0,	//2
            x1, y1, z1, 0,	//3

            x1, y1, z0, 1,	//4 Back
            x1, y0, z0, 1,	//5
            x0, y0, z0, 1,	//6
            x0, y1, z0, 1,	//7

            x0, y1, z0, 2,	//7 Left
            x0, y0, z0, 2,	//6
            x0, y0, z1, 2,	//1
            x0, y1, z1, 2,	//0

            x0, y0, z1, 3,	//1 Bottom
            x0, y0, z0, 3,	//6
            x1, y0, z0, 3,	//5
            x1, y0, z1, 3,	//2

            x1, y1, z1, 4,	//3 Right
            x1, y0, z1, 4,	//2
            x1, y0, z0, 4,	//5
            x1, y1, z0, 4,	//4

            x0, y1, z0, 5,	//7 Top
            x0, y1, z1, 5,	//0
            x1, y1, z1, 5,	//3
            x1, y1, z0, 5	//4
        ];

        //Build the index of each quad [0,1,2, 2,3,0]
        var aIndex = [];
        for(var i=0; i < aVert.length / 4; i+=2) aIndex.push(i+1, i, (Math.floor(i/4)*4)+((i+2)%4));

        //Build UV data for each vertex
        var aUV = [];
        for(var i=0; i < 6; i++) aUV.push(0,0,	0,1,  1,1,  1,0);

        //Build Normal data for each vertex
        var aNorm = [
            0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
            0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
            -1, 0, 0,	-1, 0, 0,	-1, 0,0 ,	-1, 0, 0,		//Left
            0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
            1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
            0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
        ]

        var mesh = new Mesh(gl).createMeshVAO(aVert,aIndex,aNorm,aUV,4);
        mesh.noCulling = true;
        return mesh;
    }
};