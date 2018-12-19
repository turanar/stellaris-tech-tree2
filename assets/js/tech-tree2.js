'use strict';

var config = {
    container: '#tech-tree',
    rootOrientation: 'WEST', // NORTH || EAST || WEST || SOUTH
    nodeAlign: 'TOP',
    hideRootNode: true,
    siblingSeparation: 20,
    subTeeSeparation:  20,
    connectors: {
        type: 'step'
    },
    node: {
        HTMLclass: 'tech',
        collapsable: false
    },
    callback: {
    	onTreeLoaded: function() {
			$('.node').tooltipster({
                minWidth: 300,
                trigger: 'click',
				maxWidth: 512,
                functionInit: function(instance, helper){
                    var content = $(helper.origin).find('.extra-data');
                    $(content).find('img').each(function(img, el) {
                        $(el).attr('src',$(el).attr('data-src'));
                    });
                    instance.content($('<div class="ui-tooltip">' + $(content).html() + '</div>'));
                },
                functionReady: function(instance, helper) {
                    $(helper.tooltip).find('.tooltip-content').each(function(div){
                    	var content = $(this).html();
                    	content = content.replace(new RegExp(/£(\w+)£/,'g'), '<img class="resource" src="../assets/icons/$1.png" />');
                    	$(this).html(content);
					});
                }
			});
            const observer = lozad();
            observer.observe();
		}
    }
};

function setup(tech) {
    var techClass = (tech.is_dangerous ? ' dangerous' : '')
        + (!tech.is_dangerous && tech.is_rare ? ' rare' : '');

    var tmpl = $.templates("#node-template");
    var html = tmpl.render(tech);

    tech.HTMLid = tech.key;
    tech.HTMLclass = tech.area + techClass;
    tech.innerHTML = html;

    $(tech.children).each(function(i, node){
        setup(node);
    });
};

$(document).ready(function() {
	$.getJSON('techs.json', function(techData) {
		setup(techData);

		var root = {key: "root", tier:0};
		root.children = [];
        root.children = root.children.concat(techData.children[0].children);
        root.children = root.children.concat(techData.children[1].children);
        root.children = root.children.concat(techData.children[2].children);

        new Treant({chart:config, nodeStructure: root});
    });
});