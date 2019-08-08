# SolarSystem

Project developed for the Computer Graphics course by [Alberto Floris](https://github.com/sirolf-otrebla) and [Luca Napoletano](https://github.com/lnapo94).

## The Project
The topic is to develop a **WebGL** application to navigate and explore the Solar System. The user can navigate the space using the keyboard to move the camera around and the mouse to look around.
The inputs are:

Key                         | Function
----------------------------|--------------------------------------------
Up Arrow                    | Move the camera up on Y axis
Down Arrow                  | Move the camera down on Y Axis
Left Arrow                  | Move the camera to the left on X Axis
Right Arrow                 | Move the camera to the right on X Axis
W                           | Move the camera forward on the Z Axis
S                           | Move the camera backward on the Z Axis
Click + Mouse Right or Left | Rotate the camera on the Y Axis
Click + Mouse Up or Down    | Rotate the camera on the Z Axis
Q & E                       | Rotate the camera on the Z Axis

These inputs are for the **Free** camera mode. If you want to follow the movement of one planet, you have to enter in **Lock** mode. To do it, you should press the _Space Bar_, in this way you are going to follow the movement of the Sun. If you want to change planet, press the _Space Bar_ again util you reach the desired planet. Finally, to exit the **Lock** mode, press _ALT_ and then you can move freely the camera again.

## Implementation
The _SolarSystem_ project was developed using only plain _Javascript_ and _WebGL_, without any kind of external frameworks.
The program starts from the _index.html_ files, which is the only HTML page used to load the assets (mainly the textures and the javascript files) and start the real program calling the function `loadModels`, which is used to load the JSON meshes in a proper data structure. Once it finishes, the function calls the `main()`.
The `main()` has the task to setup the main objects needed by _WebGL_ to work properly. To achieve this goal we have used some simple javascript classes like `Model`, which is the object devoted to contain all the information about a single model, like position, rotation, the applied texture, the _WebGL_ buffers and the correct shader program to use. One other important class is the `Camera` one, used to held the information about the camera and its peculiar matrices, like the inverse of the view matrix (used to render properly the scene) and the projection matrix (used to create or a perspective view or an orthographic one).
All the classes we have created have the main purpose to handle the creation of a specific matrix (i.e. the _Model Matrix_, the _View Matrix_ and the _Projection Matrix_), which are passed later to the `render()` function in order to actually represent on the canvas the model taking into account the position in the world and the projection used.
FInally, we have created a `GraphNode` class used to create the _Scene Graph_, in this way we are able to know the relationship between the various models (for instance, the moon is related to the earth's tranformation, so when the earth moves, also the moon needs to follow it) and to finally create in a simple way the correct _Model Matrix_ for each object in the scene.

## Resources
The external libraries used are:
* [JQuery](https://github.com/jquery/jquery) (To make easier the request from the client to the server)
* [GLMatrix](http://glmatrix.net/) (To simplify the code related to matrices and vectors transformation)
* [Quaternion](https://www.npmjs.com/package/quaternion) (To use the Quaternions in order to rotate properly the models)
* [WebGL-OBJ-Loader](https://github.com/frenchtoast747/webgl-obj-loader) (To load the 3D meshes inside the program)

One other mention should go to [assimp2json](https://github.com/acgessler/assimp2json) since we have used it to convert some models in _JSON_ format






