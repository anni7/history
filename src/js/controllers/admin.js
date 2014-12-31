/*global module*/
'use strict';

var directoryContents = require('../directory_contents.js'),
	imageManipulation = require('../image_manipulation.js'),
	joi = require("joi"),
	route = {},
	walkPath;

route.home = {
	description: 'Admin landing page',
	tags: ['hapi'],
	handler: function (request, reply) {
		reply.view("admin.dust");
	},
	validate: {
		query: {}
	}
};

route.apiGetGalleries = {
	description: 'List photo gallery names',
	handler: function (request, reply) {
		directoryContents.getGalleries(function (result) {
			reply(result);
		});
	},
	tags: ['hapi'],
	validate: {
		query: {}
	}
};

route.adminWalkPath = {
	description: 'inprogress',
	handler: function (request, reply) {
		var context = {
				"view": 'admin-walk_path.dust',
				"scripts": [
					'/static/lib/jquery/dist/jquery.min.js',
					'/static/js/global.js',
					'/static/js/walk-path.js',
					'//cdn.jsdelivr.net/dustjs/2.5.1/dust-core.min.js',
					'//cdn.jsdelivr.net/dustjs.helpers/1.5.0/dust-helpers.min.js',
					'/static/js/directory_contents.js',
					'/static/lib/jquery-ui-1.11.2.custom/jquery-ui.min.js',
					'/public/views.min.js'
				],
				"css": [
					'/static/lib/jquery-ui-1.11.2.custom/jquery-ui.min.css',
					'/static/css/directory_contents.css'
				]
			};
		reply.view('layout_admin', context);
	},
	notes: ['inprogress'],
	tags: ['inprogress'],
	validate: {
		query: {
			folder: joi.string().trim(),
			preview: joi.boolean()
		}
	}
};

walkPath = function (request, reply) {
	var folder = request.query.folder;
	directoryContents.getMeta(folder, function (result) {
		reply(result);
	});
};

route.apiWalkPath = {
	description: "Read the project folder's file system",
	tags: ['hapi'],
	handler: walkPath,
	validate: {
		query: {
			folder: joi.string().trim(),
			preview: joi.boolean()
		}
	}
};

route.templateWalkPath = {
	description: 'Transform walk path API to view friendly',
	tags: ['hapi', 'callback'],
	pre: [{"method": walkPath, "assign": 'meta'}],
	handler: function (request, reply) {
		var args = {
				"preview": request.query.preview
			},
			meta = request.pre.meta;
		directoryContents.prepForView(meta, args, function (result) {
			reply(result);
		});
	},
	validate: {
		query: {
			folder: joi.string().trim(),
			preview: joi.boolean()
		}
	}
};

route.adminDiffAlbumPath = {
	description: 'inprogress',
	notes: ['inprogress'],
	tags: ['deprecated'],
	handler: function (request, reply) {
		reply.view(
			'admin.node.dust',
			{
				"page": 'diff_xml',
				"scripts": [
					'/static/lib/jquery/dist/jquery.min.js',
					'/static/js/global.js',
					'/static/lib/json_to_xml.js',
					'/static/js/album-xml.js'
				],
				"css": [
				]
			}
		);
	}
};

route.previewGenerator = {
	description: 'Creates thumbnail images in a temp folder for each preview folder',
	tags: ['hapi'],
	pre: [{"method": walkPath, "assign": 'meta'}],
	handler: function (request, reply) {
		var args = {
				"folder": request.query.folder,
				"preview": request.query.preview
			},
			meta = request.pre.meta;

		imageManipulation.preview(meta, args, function (result) {
			reply(result);
		});
	},
	validate: {
		query: {
			folder: joi.string().trim(),
			preview: joi.boolean()
		}
	}
};

route.renameAssets = {
	description: 'Rename and/or move assets based on calendar date',
	tags: ['hapi', 'callback'],
	handler: function (request, reply) {
		imageManipulation.rename(
			request.payload,
			function (err, result) {
				if (err) {
					if (err.isBoom) {
						console.log(err.message);
					}
					return reply(err);
				}
				return reply(result);
			}
		);
	},
	validate: {
		payload: {
			assets: joi.object(),
			moveToResize: joi.boolean()
		}
	}
};

route.resizePhoto = {
	description: 'Resize single photo into originals, photos, thumbs folder',
	tags: ['hapi', 'callback'],
	handler: function (request, reply) {
		imageManipulation.resize(request.payload, function (result) {
			var err = result.meta.error;
			if (err) {
				return reply(err);
			}
			return reply(result);
		});
	}
};

route.deletePath = {
	description: 'Delete path (file or folder)',
	tags: ['hapi', 'callback'],
	handler: function (request, reply) {
		imageManipulation.deletePath(request.payload, function (result) {
			return reply(result);
		});
	}
};

module.exports = route;
