A Hailo admin style that requires Yahoo's PureCSS library http://purecss.io/

## Architechture:

Pure is an unopinionated, base CSS framework developed by Yahoo. It gives us a very light and free range of base objects (and a grid!) to extend upon. As the future comes, we will want to personalise this more and more. PureCSS is built to be extended, while Bootstrap (etc) are built to be themed.


### Layout

hailo.scss contains all the project files required for a normal installation. This is a toolkit, and you are free to extend and override all the classes within your own project. This file is only the bootstrap to the application; files should follow the following convention:

#### File names

Each file should have one generic purpose, IE ___Do not create 5 files for buttons, and do not have one file for all objects___.

#### Directory structure

- `base/` contains fundamental files; Fonts for all pages, colour palette, links, etc, as well as rules which must be obeyed. As well as pure.
- `components/` should contain items. Examples are buttons, lists, etc.
- `modules/` contains specific items which are reusable - a generic page structure, login, header, etc.
- `vendors/` are custom scss files for 3rd party applications which are used in a lot of projects. This should be used __only__ for custom code on-top of the vendor; vendor CSS files should be included on a per-project.
- `etc/` should not be used unless you have to. This is for misc stuff.

