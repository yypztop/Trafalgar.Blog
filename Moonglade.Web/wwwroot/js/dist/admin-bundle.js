/*! jQuery Validation Plugin - v1.19.2 - 5/23/2020
 * https://jqueryvalidation.org/
 * Copyright (c) 2020 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.submitButton=b.currentTarget,a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.submitButton&&(c.settings.submitHandler||c.formSubmitted)&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),!(c.settings.submitHandler&&!c.settings.debug)||(e=c.settings.submitHandler.call(c,c.currentForm,b),d&&d.remove(),void 0!==e&&e)}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,b||(d=d.concat(c.errorList))}),c.errorList=d),b},rules:function(b,c){var d,e,f,g,h,i,j=this[0],k="undefined"!=typeof this.attr("contenteditable")&&"false"!==this.attr("contenteditable");if(null!=j&&(!j.form&&k&&(j.form=this.closest("form")[0],j.name=this.attr("name")),null!=j.form)){if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(a,b){i[b]=f[b],delete f[b]}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g)),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}});var b=function(a){return a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")};a.extend(a.expr.pseudos||a.expr[":"],{blank:function(c){return!b(""+a(c).val())},filled:function(c){var d=a(c).val();return null!==d&&!!b(""+d)},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:void 0===c?b:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",pendingClass:"pending",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||a.inArray(c.keyCode,d)!==-1||(b.name in this.submitted||b.name in this.invalid)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}."),step:a.validator.format("Please enter a multiple of {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c="undefined"!=typeof a(this).attr("contenteditable")&&"false"!==a(this).attr("contenteditable");if(!this.form&&c&&(this.form=a(this).closest("form")[0],this.name=a(this).attr("name")),d===this.form){var e=a.data(this.form,"validator"),f="on"+b.type.replace(/^validate/,""),g=e.settings;g[f]&&!a(this).is(g.ignore)&&g[f].call(e,this,b)}}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.currentForm,e=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){e[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler)},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c,d,e=this.clean(b),f=this.validationTargetFor(e),g=this,h=!0;return void 0===f?delete this.invalid[e.name]:(this.prepareElement(f),this.currentElements=a(f),d=this.groups[f.name],d&&a.each(this.groups,function(a,b){b===d&&a!==f.name&&(e=g.validationTargetFor(g.clean(g.findByName(a))),e&&e.name in g.invalid&&(g.currentElements.push(e),h=g.check(e)&&h))}),c=this.check(f)!==!1,h=h&&c,c?this.invalid[f.name]=!1:this.invalid[f.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),a(b).attr("aria-invalid",!c)),h},showErrors:function(b){if(b){var c=this;a.extend(this.errorMap,b),this.errorList=a.map(this.errorMap,function(a,b){return{message:a,element:c.findByName(b)[0]}}),this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.invalid={},this.submitted={},this.prepareForm(),this.hideErrors();var b=this.elements().removeData("previousValue").removeAttr("aria-invalid");this.resetElements(b)},resetElements:function(a){var b;if(this.settings.unhighlight)for(b=0;a[b];b++)this.settings.unhighlight.call(this,a[b],this.settings.errorClass,""),this.findByName(a[b].name).removeClass(this.settings.validClass);else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)void 0!==a[b]&&null!==a[b]&&a[b]!==!1&&c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").trigger("focus").trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){var d=this.name||a(this).attr("name"),e="undefined"!=typeof a(this).attr("contenteditable")&&"false"!==a(this).attr("contenteditable");return!d&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),e&&(this.form=a(this).closest("form")[0],this.name=d),this.form===b.currentForm&&(!(d in c||!b.objectLength(a(this).rules()))&&(c[d]=!0,!0))})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},resetInternals:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([])},reset:function(){this.resetInternals(),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d,e=a(b),f=b.type,g="undefined"!=typeof e.attr("contenteditable")&&"false"!==e.attr("contenteditable");return"radio"===f||"checkbox"===f?this.findByName(b.name).filter(":checked").val():"number"===f&&"undefined"!=typeof b.validity?b.validity.badInput?"NaN":e.val():(c=g?e.text():e.val(),"file"===f?"C:\\fakepath\\"===c.substr(0,12)?c.substr(12):(d=c.lastIndexOf("/"),d>=0?c.substr(d+1):(d=c.lastIndexOf("\\"),d>=0?c.substr(d+1):c)):"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f,g=a(b).rules(),h=a.map(g,function(a,b){return b}).length,i=!1,j=this.elementValue(b);"function"==typeof g.normalizer?f=g.normalizer:"function"==typeof this.settings.normalizer&&(f=this.settings.normalizer),f&&(j=f.call(b,j),delete g.normalizer);for(d in g){e={method:d,parameters:g[d]};try{if(c=a.validator.methods[d].call(this,j,b,e.parameters),"dependency-mismatch"===c&&1===h){i=!0;continue}if(i=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(k){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",k),k instanceof TypeError&&(k.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),k}}if(!i)return this.objectLength(g)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]},defaultMessage:function(b,c){"string"==typeof c&&(c={method:c});var d=this.findDefined(this.customMessage(b.name,c.method),this.customDataMessage(b,c.method),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c.method],"<strong>Warning: No message defined for "+b.name+"</strong>"),e=/\$?\{(\d+)\}/g;return"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),d},formatAndAdd:function(a,b){var c=this.defaultMessage(a,b);this.errorList.push({message:c,element:a,method:b.method}),this.errorMap[a.name]=c,this.submitted[a.name]=c},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g,h=this.errorsFor(b),i=this.idOrName(b),j=a(b).attr("aria-describedby");h.length?(h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),h.html(c)):(h=a("<"+this.settings.errorElement+">").attr("id",i+"-error").addClass(this.settings.errorClass).html(c||""),d=h,this.settings.wrapper&&(d=h.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement.call(this,d,a(b)):d.insertAfter(b),h.is("label")?h.attr("for",i):0===h.parents("label[for='"+this.escapeCssMeta(i)+"']").length&&(f=h.attr("id"),j?j.match(new RegExp("\\b"+this.escapeCssMeta(f)+"\\b"))||(j+=" "+f):j=f,a(b).attr("aria-describedby",j),e=this.groups[b.name],e&&(g=this,a.each(g.groups,function(b,c){c===e&&a("[name='"+g.escapeCssMeta(b)+"']",g.currentForm).attr("aria-describedby",h.attr("id"))})))),!c&&this.settings.success&&(h.text(""),"string"==typeof this.settings.success?h.addClass(this.settings.success):this.settings.success(h,b)),this.toShow=this.toShow.add(h)},errorsFor:function(b){var c=this.escapeCssMeta(this.idOrName(b)),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+this.escapeCssMeta(d).replace(/\s+/g,", #")),this.errors().filter(e)},escapeCssMeta:function(a){return a.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g,"\\$1")},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+this.escapeCssMeta(b)+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return!this.dependTypes[typeof a]||this.dependTypes[typeof a](a,b)},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){this.pending[b.name]||(this.pendingRequest++,a(b).addClass(this.settings.pendingClass),this.pending[b.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],a(b).removeClass(this.settings.pendingClass),c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.submitButton&&a("input:hidden[name='"+this.submitButton.name+"']",this.currentForm).remove(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b,c){return c="string"==typeof c&&c||"remote",a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,{method:c})})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur").find(".validate-lessThan-blur").off(".validate-lessThan").removeClass("validate-lessThan-blur").find(".validate-lessThanEqual-blur").off(".validate-lessThanEqual").removeClass("validate-lessThanEqual-blur").find(".validate-greaterThanEqual-blur").off(".validate-greaterThanEqual").removeClass("validate-greaterThanEqual-blur").find(".validate-greaterThan-blur").off(".validate-greaterThan").removeClass("validate-greaterThan-blur")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max|step/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),""===d&&(d=!0),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0===e.param||e.param:(a.data(c.form,"validator").resetElements(a(c)),delete b[d])}}),a.each(b,function(d,e){b[d]=a.isFunction(e)&&"normalizer"!==d?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:void 0!==b&&null!==b&&b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(a)},date:function(){var a=!1;return function(b,c){return a||(a=!0,this.settings.debug&&window.console&&console.warn("The `date` method is deprecated and will be removed in version '2.0.0'.\nPlease don't use it, since it relies on the Date constructor, which\nbehaves very differently across browsers and locales. Use `dateISO`\ninstead or one of the locale specific methods in `localizations/`\nand `additional-methods.js`.")),this.optional(c)||!/Invalid|NaN/.test(new Date(b).toString())}}(),dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e<=d},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||a<=c},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},step:function(b,c,d){var e,f=a(c).attr("type"),g="Step attribute on input type "+f+" is not supported.",h=["text","number","range"],i=new RegExp("\\b"+f+"\\b"),j=f&&!i.test(h.join()),k=function(a){var b=(""+a).match(/(?:\.(\d+))?$/);return b&&b[1]?b[1].length:0},l=function(a){return Math.round(a*Math.pow(10,e))},m=!0;if(j)throw new Error(g);return e=k(d),(k(b)>e||l(b)%l(d)!==0)&&(m=!1),this.optional(c)||m},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.not(".validate-equalTo-blur").length&&e.addClass("validate-equalTo-blur").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d,e){if(this.optional(c))return"dependency-mismatch";e="string"==typeof e&&e||"remote";var f,g,h,i=this.previousValue(c,e);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),i.originalMessage=i.originalMessage||this.settings.messages[c.name][e],this.settings.messages[c.name][e]=i.message,d="string"==typeof d&&{url:d}||d,h=a.param(a.extend({data:b},d.data)),i.old===h?i.valid:(i.old=h,f=this,this.startRequest(c),g={},g[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:g,context:f.currentForm,success:function(a){var d,g,h,j=a===!0||"true"===a;f.settings.messages[c.name][e]=i.originalMessage,j?(h=f.formSubmitted,f.resetInternals(),f.toHide=f.errorsFor(c),f.formSubmitted=h,f.successList.push(c),f.invalid[c.name]=!1,f.showErrors()):(d={},g=a||f.defaultMessage(c,{method:e,parameters:b}),d[c.name]=i.message=g,f.invalid[c.name]=!0,f.showErrors(d)),i.valid=j,f.stopRequest(c,j)}},d)),"pending")}}});var c,d={};return a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,c){var e=a.port;"abort"===a.mode&&(d[e]&&d[e].abort(),d[e]=c)}):(c=a.ajax,a.ajax=function(b){var e=("mode"in b?b:a.ajaxSettings).mode,f=("port"in b?b:a.ajaxSettings).port;return"abort"===e?(d[f]&&d[f].abort(),d[f]=c.apply(this,arguments),d[f]):c.apply(this,arguments)}),a});
// Unobtrusive validation support library for jQuery and jQuery Validate
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// @version v3.2.11
!function(a){"function"==typeof define&&define.amd?define("jquery.validate.unobtrusive",["jquery-validation"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery-validation")):jQuery.validator.unobtrusive=a(jQuery)}(function(a){function e(a,e,n){a.rules[e]=n,a.message&&(a.messages[e]=a.message)}function n(a){return a.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/g)}function t(a){return a.replace(/([!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~])/g,"\\$1")}function r(a){return a.substr(0,a.lastIndexOf(".")+1)}function i(a,e){return 0===a.indexOf("*.")&&(a=a.replace("*.",e)),a}function o(e,n){var r=a(this).find("[data-valmsg-for='"+t(n[0].name)+"']"),i=r.attr("data-valmsg-replace"),o=i?a.parseJSON(i)!==!1:null;r.removeClass("field-validation-valid").addClass("field-validation-error"),e.data("unobtrusiveContainer",r),o?(r.empty(),e.removeClass("input-validation-error").appendTo(r)):e.hide()}function d(e,n){var t=a(this).find("[data-valmsg-summary=true]"),r=t.find("ul");r&&r.length&&n.errorList.length&&(r.empty(),t.addClass("validation-summary-errors").removeClass("validation-summary-valid"),a.each(n.errorList,function(){a("<li />").html(this.message).appendTo(r)}))}function s(e){var n=e.data("unobtrusiveContainer");if(n){var t=n.attr("data-valmsg-replace"),r=t?a.parseJSON(t):null;n.addClass("field-validation-valid").removeClass("field-validation-error"),e.removeData("unobtrusiveContainer"),r&&n.empty()}}function l(e){var n=a(this),t="__jquery_unobtrusive_validation_form_reset";if(!n.data(t)){n.data(t,!0);try{n.data("validator").resetForm()}finally{n.removeData(t)}n.find(".validation-summary-errors").addClass("validation-summary-valid").removeClass("validation-summary-errors"),n.find(".field-validation-error").addClass("field-validation-valid").removeClass("field-validation-error").removeData("unobtrusiveContainer").find(">*").removeData("unobtrusiveContainer")}}function u(e){var n=a(e),t=n.data(v),r=a.proxy(l,e),i=f.unobtrusive.options||{},u=function(n,t){var r=i[n];r&&a.isFunction(r)&&r.apply(e,t)};return t||(t={options:{errorClass:i.errorClass||"input-validation-error",errorElement:i.errorElement||"span",errorPlacement:function(){o.apply(e,arguments),u("errorPlacement",arguments)},invalidHandler:function(){d.apply(e,arguments),u("invalidHandler",arguments)},messages:{},rules:{},success:function(){s.apply(e,arguments),u("success",arguments)}},attachValidation:function(){n.off("reset."+v,r).on("reset."+v,r).validate(this.options)},validate:function(){return n.validate(),n.valid()}},n.data(v,t)),t}var m,f=a.validator,v="unobtrusiveValidation";return f.unobtrusive={adapters:[],parseElement:function(e,n){var t,r,i,o=a(e),d=o.parents("form")[0];d&&(t=u(d),t.options.rules[e.name]=r={},t.options.messages[e.name]=i={},a.each(this.adapters,function(){var n="data-val-"+this.name,t=o.attr(n),s={};void 0!==t&&(n+="-",a.each(this.params,function(){s[this]=o.attr(n+this)}),this.adapt({element:e,form:d,message:t,params:s,rules:r,messages:i}))}),a.extend(r,{__dummy__:!0}),n||t.attachValidation())},parse:function(e){var n=a(e),t=n.parents().addBack().filter("form").add(n.find("form")).has("[data-val=true]");n.find("[data-val=true]").each(function(){f.unobtrusive.parseElement(this,!0)}),t.each(function(){var a=u(this);a&&a.attachValidation()})}},m=f.unobtrusive.adapters,m.add=function(a,e,n){return n||(n=e,e=[]),this.push({name:a,params:e,adapt:n}),this},m.addBool=function(a,n){return this.add(a,function(t){e(t,n||a,!0)})},m.addMinMax=function(a,n,t,r,i,o){return this.add(a,[i||"min",o||"max"],function(a){var i=a.params.min,o=a.params.max;i&&o?e(a,r,[i,o]):i?e(a,n,i):o&&e(a,t,o)})},m.addSingleVal=function(a,n,t){return this.add(a,[n||"val"],function(r){e(r,t||a,r.params[n])})},f.addMethod("__dummy__",function(a,e,n){return!0}),f.addMethod("regex",function(a,e,n){var t;return!!this.optional(e)||(t=new RegExp(n).exec(a),t&&0===t.index&&t[0].length===a.length)}),f.addMethod("nonalphamin",function(a,e,n){var t;return n&&(t=a.match(/\W/g),t=t&&t.length>=n),t}),f.methods.extension?(m.addSingleVal("accept","mimtype"),m.addSingleVal("extension","extension")):m.addSingleVal("extension","extension","accept"),m.addSingleVal("regex","pattern"),m.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url"),m.addMinMax("length","minlength","maxlength","rangelength").addMinMax("range","min","max","range"),m.addMinMax("minlength","minlength").addMinMax("maxlength","minlength","maxlength"),m.add("equalto",["other"],function(n){var o=r(n.element.name),d=n.params.other,s=i(d,o),l=a(n.form).find(":input").filter("[name='"+t(s)+"']")[0];e(n,"equalTo",l)}),m.add("required",function(a){"INPUT"===a.element.tagName.toUpperCase()&&"CHECKBOX"===a.element.type.toUpperCase()||e(a,"required",!0)}),m.add("remote",["url","type","additionalfields"],function(o){var d={url:o.params.url,type:o.params.type||"GET",data:{}},s=r(o.element.name);a.each(n(o.params.additionalfields||o.element.name),function(e,n){var r=i(n,s);d.data[r]=function(){var e=a(o.form).find(":input").filter("[name='"+t(r)+"']");return e.is(":checkbox")?e.filter(":checked").val()||e.filter(":hidden").val()||"":e.is(":radio")?e.filter(":checked").val()||"":e.val()}}),e(o,"remote",d)}),m.add("password",["min","nonalphamin","regex"],function(a){a.params.min&&e(a,"minlength",a.params.min),a.params.nonalphamin&&e(a,"nonalphamin",a.params.nonalphamin),a.params.regex&&e(a,"regex",a.params.regex)}),m.add("fileextensions",["extensions"],function(a){e(a,"extension",a.params.extensions)}),a(function(){f.unobtrusive.parse(document)}),f.unobtrusive});
// Unobtrusive Ajax support library for jQuery
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// @version v3.2.6
// 
// Microsoft grants you the right to use these script files for the sole
// purpose of either: (i) interacting through your browser with the Microsoft
// website or online service, subject to the applicable licensing or use
// terms; or (ii) using the files as included with a Microsoft product subject
// to that product's license terms. Microsoft reserves all other rights to the
// files not expressly granted by Microsoft, whether by implication, estoppel
// or otherwise. Insofar as a script file is dual licensed under GPL,
// Microsoft neither took the code under GPL nor distributes it thereunder but
// under the terms set out in this paragraph. All notices and licenses
// below are for informational purposes only.
!function(t){function a(t,a){for(var e=window,r=(t||"").split(".");e&&r.length;)e=e[r.shift()];return"function"==typeof e?e:(a.push(t),Function.constructor.apply(null,a))}function e(t){return"GET"===t||"POST"===t}function r(t,a){e(a)||t.setRequestHeader("X-HTTP-Method-Override",a)}function n(a,e,r){var n;r.indexOf("application/x-javascript")===-1&&(n=(a.getAttribute("data-ajax-mode")||"").toUpperCase(),t(a.getAttribute("data-ajax-update")).each(function(a,r){switch(n){case"BEFORE":t(r).prepend(e);break;case"AFTER":t(r).append(e);break;case"REPLACE-WITH":t(r).replaceWith(e);break;default:t(r).html(e)}}))}function i(i,u){var o,c,d,s;if(o=i.getAttribute("data-ajax-confirm"),!o||window.confirm(o)){c=t(i.getAttribute("data-ajax-loading")),s=parseInt(i.getAttribute("data-ajax-loading-duration"),10)||0,t.extend(u,{type:i.getAttribute("data-ajax-method")||void 0,url:i.getAttribute("data-ajax-url")||void 0,cache:"true"===(i.getAttribute("data-ajax-cache")||"").toLowerCase(),beforeSend:function(t){var e;return r(t,d),e=a(i.getAttribute("data-ajax-begin"),["xhr"]).apply(i,arguments),e!==!1&&c.show(s),e},complete:function(){c.hide(s),a(i.getAttribute("data-ajax-complete"),["xhr","status"]).apply(i,arguments)},success:function(t,e,r){n(i,t,r.getResponseHeader("Content-Type")||"text/html"),a(i.getAttribute("data-ajax-success"),["data","status","xhr"]).apply(i,arguments)},error:function(){a(i.getAttribute("data-ajax-failure"),["xhr","status","error"]).apply(i,arguments)}}),u.data.push({name:"X-Requested-With",value:"XMLHttpRequest"}),d=u.type.toUpperCase(),e(d)||(u.type="POST",u.data.push({name:"X-HTTP-Method-Override",value:d}));var p=t(i);if(p.is("form")&&"multipart/form-data"==p.attr("enctype")){var f=new FormData;t.each(u.data,function(t,a){f.append(a.name,a.value)}),t("input[type=file]",p).each(function(){var a=this;t.each(a.files,function(t,e){f.append(a.name,e)})}),t.extend(u,{processData:!1,contentType:!1,data:f})}t.ajax(u)}}function u(a){var e=t(a).data(d);return!e||!e.validate||e.validate()}var o="unobtrusiveAjaxClick",c="unobtrusiveAjaxClickTarget",d="unobtrusiveValidation";t(document).on("click","a[data-ajax=true]",function(t){t.preventDefault(),i(this,{url:this.href,type:"GET",data:[]})}),t(document).on("click","form[data-ajax=true] input[type=image]",function(a){var e=a.target.name,r=t(a.target),n=t(r.parents("form")[0]),i=r.offset();n.data(o,[{name:e+".x",value:Math.round(a.pageX-i.left)},{name:e+".y",value:Math.round(a.pageY-i.top)}]),setTimeout(function(){n.removeData(o)},0)}),t(document).on("click","form[data-ajax=true] :submit",function(a){var e=a.currentTarget.name,r=t(a.target),n=t(r.parents("form")[0]);n.data(o,e?[{name:e,value:a.currentTarget.value}]:[]),n.data(c,r),setTimeout(function(){n.removeData(o),n.removeData(c)},0)}),t(document).on("submit","form[data-ajax=true]",function(a){var e=t(this).data(o)||[],r=t(this).data(c),n=r&&(r.hasClass("cancel")||void 0!==r.attr("formnovalidate"));a.preventDefault(),(n||u(this))&&i(this,{url:this.action,type:this.method||"GET",data:e.concat(t(this).serializeArray())})})}(jQuery);
/*
 * bootstrap-tagsinput v0.8.0
 * 
 */

!function(a){"use strict";function b(b,c){this.isInit=!0,this.itemsArray=[],this.$element=a(b),this.$element.hide(),this.isSelect="SELECT"===b.tagName,this.multiple=this.isSelect&&b.hasAttribute("multiple"),this.objectItems=c&&c.itemValue,this.placeholderText=b.hasAttribute("placeholder")?this.$element.attr("placeholder"):"",this.inputSize=Math.max(1,this.placeholderText.length),this.$container=a('<div class="bootstrap-tagsinput"></div>'),this.$input=a('<input type="text" placeholder="'+this.placeholderText+'"/>').appendTo(this.$container),this.$element.before(this.$container),this.build(c),this.isInit=!1}function c(a,b){if("function"!=typeof a[b]){var c=a[b];a[b]=function(a){return a[c]}}}function d(a,b){if("function"!=typeof a[b]){var c=a[b];a[b]=function(){return c}}}function e(a){return a?i.text(a).html():""}function f(a){var b=0;if(document.selection){a.focus();var c=document.selection.createRange();c.moveStart("character",-a.value.length),b=c.text.length}else(a.selectionStart||"0"==a.selectionStart)&&(b=a.selectionStart);return b}function g(b,c){var d=!1;return a.each(c,function(a,c){if("number"==typeof c&&b.which===c)return d=!0,!1;if(b.which===c.which){var e=!c.hasOwnProperty("altKey")||b.altKey===c.altKey,f=!c.hasOwnProperty("shiftKey")||b.shiftKey===c.shiftKey,g=!c.hasOwnProperty("ctrlKey")||b.ctrlKey===c.ctrlKey;if(e&&f&&g)return d=!0,!1}}),d}var h={tagClass:function(a){return"label label-info"},focusClass:"focus",itemValue:function(a){return a?a.toString():a},itemText:function(a){return this.itemValue(a)},itemTitle:function(a){return null},freeInput:!0,addOnBlur:!0,maxTags:void 0,maxChars:void 0,confirmKeys:[13,44],delimiter:",",delimiterRegex:null,cancelConfirmKeysOnEmpty:!1,onTagExists:function(a,b){b.hide().fadeIn()},trimValue:!1,allowDuplicates:!1,triggerChange:!0};b.prototype={constructor:b,add:function(b,c,d){var f=this;if(!(f.options.maxTags&&f.itemsArray.length>=f.options.maxTags)&&(b===!1||b)){if("string"==typeof b&&f.options.trimValue&&(b=a.trim(b)),"object"==typeof b&&!f.objectItems)throw"Can't add objects when itemValue option is not set";if(!b.toString().match(/^\s*$/)){if(f.isSelect&&!f.multiple&&f.itemsArray.length>0&&f.remove(f.itemsArray[0]),"string"==typeof b&&"INPUT"===this.$element[0].tagName){var g=f.options.delimiterRegex?f.options.delimiterRegex:f.options.delimiter,h=b.split(g);if(h.length>1){for(var i=0;i<h.length;i++)this.add(h[i],!0);return void(c||f.pushVal(f.options.triggerChange))}}var j=f.options.itemValue(b),k=f.options.itemText(b),l=f.options.tagClass(b),m=f.options.itemTitle(b),n=a.grep(f.itemsArray,function(a){return f.options.itemValue(a)===j})[0];if(!n||f.options.allowDuplicates){if(!(f.items().toString().length+b.length+1>f.options.maxInputLength)){var o=a.Event("beforeItemAdd",{item:b,cancel:!1,options:d});if(f.$element.trigger(o),!o.cancel){f.itemsArray.push(b);var p=a('<span class="tag '+e(l)+(null!==m?'" title="'+m:"")+'">'+e(k)+'<span data-role="remove"></span></span>');p.data("item",b),f.findInputWrapper().before(p),p.after(" ");var q=a('option[value="'+encodeURIComponent(j)+'"]',f.$element).length||a('option[value="'+e(j)+'"]',f.$element).length;if(f.isSelect&&!q){var r=a("<option selected>"+e(k)+"</option>");r.data("item",b),r.attr("value",j),f.$element.append(r)}c||f.pushVal(f.options.triggerChange),(f.options.maxTags===f.itemsArray.length||f.items().toString().length===f.options.maxInputLength)&&f.$container.addClass("bootstrap-tagsinput-max"),a(".typeahead, .twitter-typeahead",f.$container).length&&f.$input.typeahead("val",""),this.isInit?f.$element.trigger(a.Event("itemAddedOnInit",{item:b,options:d})):f.$element.trigger(a.Event("itemAdded",{item:b,options:d}))}}}else if(f.options.onTagExists){var s=a(".tag",f.$container).filter(function(){return a(this).data("item")===n});f.options.onTagExists(b,s)}}}},remove:function(b,c,d){var e=this;if(e.objectItems&&(b="object"==typeof b?a.grep(e.itemsArray,function(a){return e.options.itemValue(a)==e.options.itemValue(b)}):a.grep(e.itemsArray,function(a){return e.options.itemValue(a)==b}),b=b[b.length-1]),b){var f=a.Event("beforeItemRemove",{item:b,cancel:!1,options:d});if(e.$element.trigger(f),f.cancel)return;a(".tag",e.$container).filter(function(){return a(this).data("item")===b}).remove(),a("option",e.$element).filter(function(){return a(this).data("item")===b}).remove(),-1!==a.inArray(b,e.itemsArray)&&e.itemsArray.splice(a.inArray(b,e.itemsArray),1)}c||e.pushVal(e.options.triggerChange),e.options.maxTags>e.itemsArray.length&&e.$container.removeClass("bootstrap-tagsinput-max"),e.$element.trigger(a.Event("itemRemoved",{item:b,options:d}))},removeAll:function(){var b=this;for(a(".tag",b.$container).remove(),a("option",b.$element).remove();b.itemsArray.length>0;)b.itemsArray.pop();b.pushVal(b.options.triggerChange)},refresh:function(){var b=this;a(".tag",b.$container).each(function(){var c=a(this),d=c.data("item"),f=b.options.itemValue(d),g=b.options.itemText(d),h=b.options.tagClass(d);if(c.attr("class",null),c.addClass("tag "+e(h)),c.contents().filter(function(){return 3==this.nodeType})[0].nodeValue=e(g),b.isSelect){var i=a("option",b.$element).filter(function(){return a(this).data("item")===d});i.attr("value",f)}})},items:function(){return this.itemsArray},pushVal:function(){var b=this,c=a.map(b.items(),function(a){return b.options.itemValue(a).toString()});b.$element.val(c,!0),b.options.triggerChange&&b.$element.trigger("change")},build:function(b){var e=this;if(e.options=a.extend({},h,b),e.objectItems&&(e.options.freeInput=!1),c(e.options,"itemValue"),c(e.options,"itemText"),d(e.options,"tagClass"),e.options.typeahead){var i=e.options.typeahead||{};d(i,"source"),e.$input.typeahead(a.extend({},i,{source:function(b,c){function d(a){for(var b=[],d=0;d<a.length;d++){var g=e.options.itemText(a[d]);f[g]=a[d],b.push(g)}c(b)}this.map={};var f=this.map,g=i.source(b);a.isFunction(g.success)?g.success(d):a.isFunction(g.then)?g.then(d):a.when(g).then(d)},updater:function(a){return e.add(this.map[a]),this.map[a]},matcher:function(a){return-1!==a.toLowerCase().indexOf(this.query.trim().toLowerCase())},sorter:function(a){return a.sort()},highlighter:function(a){var b=new RegExp("("+this.query+")","gi");return a.replace(b,"<strong>$1</strong>")}}))}if(e.options.typeaheadjs){var j=null,k={},l=e.options.typeaheadjs;a.isArray(l)?(j=l[0],k=l[1]):k=l,e.$input.typeahead(j,k).on("typeahead:selected",a.proxy(function(a,b){k.valueKey?e.add(b[k.valueKey]):e.add(b),e.$input.typeahead("val","")},e))}e.$container.on("click",a.proxy(function(a){e.$element.attr("disabled")||e.$input.removeAttr("disabled"),e.$input.focus()},e)),e.options.addOnBlur&&e.options.freeInput&&e.$input.on("focusout",a.proxy(function(b){0===a(".typeahead, .twitter-typeahead",e.$container).length&&(e.add(e.$input.val()),e.$input.val(""))},e)),e.$container.on({focusin:function(){e.$container.addClass(e.options.focusClass)},focusout:function(){e.$container.removeClass(e.options.focusClass)}}),e.$container.on("keydown","input",a.proxy(function(b){var c=a(b.target),d=e.findInputWrapper();if(e.$element.attr("disabled"))return void e.$input.attr("disabled","disabled");switch(b.which){case 8:if(0===f(c[0])){var g=d.prev();g.length&&e.remove(g.data("item"))}break;case 46:if(0===f(c[0])){var h=d.next();h.length&&e.remove(h.data("item"))}break;case 37:var i=d.prev();0===c.val().length&&i[0]&&(i.before(d),c.focus());break;case 39:var j=d.next();0===c.val().length&&j[0]&&(j.after(d),c.focus())}var k=c.val().length;Math.ceil(k/5);c.attr("size",Math.max(this.inputSize,c.val().length))},e)),e.$container.on("keypress","input",a.proxy(function(b){var c=a(b.target);if(e.$element.attr("disabled"))return void e.$input.attr("disabled","disabled");var d=c.val(),f=e.options.maxChars&&d.length>=e.options.maxChars;e.options.freeInput&&(g(b,e.options.confirmKeys)||f)&&(0!==d.length&&(e.add(f?d.substr(0,e.options.maxChars):d),c.val("")),e.options.cancelConfirmKeysOnEmpty===!1&&b.preventDefault());var h=c.val().length;Math.ceil(h/5);c.attr("size",Math.max(this.inputSize,c.val().length))},e)),e.$container.on("click","[data-role=remove]",a.proxy(function(b){e.$element.attr("disabled")||e.remove(a(b.target).closest(".tag").data("item"))},e)),e.options.itemValue===h.itemValue&&("INPUT"===e.$element[0].tagName?e.add(e.$element.val()):a("option",e.$element).each(function(){e.add(a(this).attr("value"),!0)}))},destroy:function(){var a=this;a.$container.off("keypress","input"),a.$container.off("click","[role=remove]"),a.$container.remove(),a.$element.removeData("tagsinput"),a.$element.show()},focus:function(){this.$input.focus()},input:function(){return this.$input},findInputWrapper:function(){for(var b=this.$input[0],c=this.$container[0];b&&b.parentNode!==c;)b=b.parentNode;return a(b)}},a.fn.tagsinput=function(c,d,e){var f=[];return this.each(function(){var g=a(this).data("tagsinput");if(g)if(c||d){if(void 0!==g[c]){if(3===g[c].length&&void 0!==e)var h=g[c](d,null,e);else var h=g[c](d);void 0!==h&&f.push(h)}}else f.push(g);else g=new b(this,c),a(this).data("tagsinput",g),f.push(g),"SELECT"===this.tagName&&a("option",a(this)).attr("selected","selected"),a(this).val(a(this).val())}),"string"==typeof c?f.length>1?f:f[0]:f},a.fn.tagsinput.Constructor=b;var i=a("<div />");a(function(){a("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput()})}(window.jQuery);
//# sourceMappingURL=bootstrap-tagsinput.min.js.map
/*!
 * jQuery Plugin: Are-You-Sure (Dirty Form Detection)
 * https://github.com/codedance/jquery.AreYouSure/
 *
 * Copyright (c) 2012-2014, Chris Dance and PaperCut Software http://www.papercut.com/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Author:  chris.dance@papercut.com
 * Version: 1.9.0
 * Date:    13th August 2014
 */
(function(a){a.fn.areYouSure=function(j){var d=a.extend({message:"You have unsaved changes!",dirtyClass:"dirty",change:null,silent:false,addRemoveFieldsMarksDirty:false,fieldEvents:"change keyup propertychange input",fieldSelector:":input:not(input[type=submit]):not(input[type=button])"},j);var e=function(l){if(l.hasClass("ays-ignore")||l.hasClass("aysIgnore")||l.attr("data-ays-ignore")||l.attr("name")===undefined){return null}if(l.is(":disabled")){return"ays-disabled"}var m;var k=l.attr("type");if(l.is("select")){k="select"}switch(k){case"checkbox":case"radio":m=l.is(":checked");break;case"select":m="";l.find("option").each(function(p){var n=a(this);if(n.is(":selected")){m+=n.val()}});break;default:m=l.val()}return m};var i=function(k){k.data("ays-orig",e(k))};var g=function(l){var n=function(q){var p=q.data("ays-orig");if(undefined===p){return false}return(e(q)!=p)};var m=(a(this).is("form"))?a(this):a(this).parents("form");if(n(a(l.target))){c(m,true);return}$fields=m.find(d.fieldSelector);if(d.addRemoveFieldsMarksDirty){var k=m.data("ays-orig-field-count");if(k!=$fields.length){c(m,true);return}}var o=false;$fields.each(function(){$field=a(this);if(n($field)){o=true;return false}});c(m,o)};var f=function(l){var k=l.find(d.fieldSelector);a(k).each(function(){i(a(this))});a(k).unbind(d.fieldEvents,g);a(k).bind(d.fieldEvents,g);l.data("ays-orig-field-count",a(k).length);c(l,false)};var c=function(k,l){var m=l!=k.hasClass(d.dirtyClass);k.toggleClass(d.dirtyClass,l);if(m){if(d.change){d.change.call(k,k)}if(l){k.trigger("dirty.areYouSure",[k])}if(!l){k.trigger("clean.areYouSure",[k])}k.trigger("change.areYouSure",[k])}};var b=function(){var l=a(this);var k=l.find(d.fieldSelector);a(k).each(function(){var m=a(this);if(!m.data("ays-orig")){i(m);m.bind(d.fieldEvents,g)}});l.trigger("checkform.areYouSure")};var h=function(){f(a(this))};if(!d.silent&&!window.aysUnloadSet){window.aysUnloadSet=true;a(window).bind("beforeunload",function(){$dirtyForms=a("form").filter("."+d.dirtyClass);if($dirtyForms.length==0){return}if(navigator.userAgent.toLowerCase().match(/msie|chrome/)){if(window.aysHasPrompted){return}window.aysHasPrompted=true;window.setTimeout(function(){window.aysHasPrompted=false},900)}return d.message})}return this.each(function(l){if(!a(this).is("form")){return}var k=a(this);k.submit(function(){k.removeClass(d.dirtyClass)});k.bind("reset",function(){c(k,false)});k.bind("rescan.areYouSure",b);k.bind("reinitialize.areYouSure",h);k.bind("checkform.areYouSure",g);f(k)})}})(jQuery);
$.validator.setDefaults({
    ignore: []
});

var emptyGuid = '00000000-0000-0000-0000-000000000000';

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

function ImageUploader(targetName, hw, imgMimeType) {
    var imgDataUrl = '';

    this.uploadImage = function (uploadUrl) {
        if (imgDataUrl) {
            $(`#btn-upload-${targetName}`).addClass('disabled');
            $(`#btn-upload-${targetName}`).attr('disabled', 'disabled');

            var rawData = { base64Img: imgDataUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '') };
            $.ajax({
                type: 'POST',
                headers: { 'XSRF-TOKEN': $(`input[name=${csrfFieldName}]`).val() },
                url: uploadUrl,
                data: rawData,
                success: function (data) {
                    console.info(data);
                    $(`#${targetName}modal`).modal('hide');
                    toastr.success('Updated');
                    d = new Date();
                    $(`.blogadmin-${targetName}`).attr('src', `/${targetName}?${d.getTime()}`);
                },
                statusCode: {
                    400: function (responseObject, textStatus, jqXHR) {
                        var message = buildErrorMessage(responseObject);
                        toastr.error(message);
                    },
                    401: function (responseObject, textStatus, jqXHR) {
                        toastr.error('Unauthorized');
                    },
                    404: function (responseObject, textStatus, jqXHR) {
                        toastr.error('Endpoint not found');
                    },
                    409: function (responseObject, textStatus, jqXHR) {
                        var message = buildErrorMessage(responseObject);
                        toastr.error(message);
                    },
                    500: function (responseObject, textStatus, jqXHR) {
                        toastr.error('Server went boom');
                    },
                    503: function (responseObject, textStatus, jqXHR) {
                        toastr.error('Server went boom boom');
                    }
                },
                error: function (xhr, status, err) {
                    $(`#btn-upload-${targetName}`).removeClass('disabled');
                    $(`#btn-upload-${targetName}`).removeAttr('disabled');
                }
            });
        } else {
            toastr.error('Please select an image');
        }
    }

    this.fileSelect = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var file;
            if (evt.dataTransfer) {
                file = evt.dataTransfer.files[0];
                $(`.custom-file-label-${targetName}`).text(file.name);
            } else {
                file = evt.target.files[0];
            }

            if (!file.type.match('image.*')) {
                toastr.error('Please select an image file.');
                return;
            }

            var reader = new FileReader();
            reader.onloadend = function () {
                var tempImg = new Image();
                tempImg.src = reader.result;
                tempImg.onload = function () {
                    var maxWidth = hw;
                    var maxHeight = hw;
                    var tempW = tempImg.width;
                    var tempH = tempImg.height;
                    if (tempW > tempH) {
                        if (tempW > maxWidth) {
                            tempH *= maxWidth / tempW;
                            tempW = maxWidth;
                        }
                    } else {
                        if (tempH > maxHeight) {
                            tempW *= maxHeight / tempH;
                            tempH = maxHeight;
                        }
                    }

                    var canvas = document.createElement('canvas');
                    canvas.width = tempW;
                    canvas.height = tempH;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0, tempW, tempH);
                    imgDataUrl = canvas.toDataURL(imgMimeType);

                    var div = $(`#${targetName}DropTarget`);
                    div.html(`<img class="img-fluid" src="${imgDataUrl}" />`);
                    $(`#btn-upload-${targetName}`).removeClass('disabled');
                    $(`#btn-upload-${targetName}`).removeAttr('disabled');
                }
            }
            reader.readAsDataURL(file);
        } else {
            toastr.error('The File APIs are not fully supported in this browser.');
        }
    }

    this.dragOver = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }

    this.bindEvents = function () {
        document.getElementById(`${targetName}ImageFile`).addEventListener('change', this.fileSelect, false);
        var dropTarget = document.getElementById(`${targetName}DropTarget`);
        dropTarget.addEventListener('dragover', this.dragOver, false);
        dropTarget.addEventListener('drop', this.fileSelect, false);
    }

    this.getDataUrl = function () {
        return imgDataUrl;
    };
};

var isPreviewRequired = false;

var postEditor = {
    loadRichEditor: function (textareaSelector) {
        if (window.tinyMCE !== undefined) {
            window.tinyMCE.init({
                selector: textareaSelector,
                themes: 'silver',
                skin: 'oxide',
                //height: 650,
                relative_urls: false, // avoid image upload fuck up
                browser_spellcheck: true,
                branding: false,
                block_formats: 'Paragraph=p; Header 2=h2; Header 3=h3; Header 4=h4; Preformatted=pre',
                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                plugins: 'advlist autolink hr autosave link image lists charmap print preview hr anchor pagebreak spellchecker searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table directionality template paste codesample imagetools emoticons',
                toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough | forecolor backcolor | removeformat | emoticons link hr image table codesample media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code | fullscreen',
                save_onsavecallback: function() {
                    $('#btn-save').trigger('click');
                },
                paste_data_images: true,
                images_upload_url: '/image',
                images_upload_credentials: true,
                body_class: 'post-content',
                content_css: '/css/tinymce-bs-bundle.min.css',
                codesample_languages: [
                    { text: 'Bash', value: 'bash' },
                    { text: 'C#', value: 'csharp' },
                    { text: 'C', value: 'c' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'CSS', value: 'css' },
                    { text: 'F#', value: 'fsharp' },
                    { text: 'HTML/XML', value: 'markup' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'Json', value: 'json' },
                    { text: 'PowerShell', value: 'powershell' },
                    { text: 'Python', value: 'python' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Ruby', value: 'ruby' },
                    { text: 'SQL', value: 'sql' },
                    { text: 'Visual Basic', value: 'vb' }
                ],
                setup: function (editor) {
                    editor.on('NodeChange', function (e) {
                        if (e.element.tagName === 'IMG') {
                            e.element.setAttribute('loading', 'lazy');
                        }
                    });
                }
            });
        }
    },
    loadMdEditor: function (textareaSelector) {
        if (window.SimpleMDE) {
            var simplemde = new SimpleMDE({
                element: $(textareaSelector)[0],
                spellChecker: false,
                status: false
            });

            inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
                uploadUrl: '/image',
                urlText: '![file](/image/{filename})',
                onFileUploadResponse: function (xhr) {
                    var result = JSON.parse(xhr.responseText),
                        filename = result[this.settings.jsonFieldName];

                    if (result && filename) {
                        var newValue;
                        if (typeof this.settings.urlText === 'function') {
                            newValue = this.settings.urlText.call(this, filename, result);
                        } else {
                            newValue = this.settings.urlText.replace(this.filenameTag, filename);
                        }
                        var text = this.editor.getValue().replace(this.lastValue, newValue);
                        this.editor.setValue(text);
                        this.settings.onFileUploaded.call(this, filename);
                    }
                    return false;
                }
            });
        }
    },
    initEvents: function () {
        $('#Title').change(function () {
            $('#Slug').val(slugify($(this).val()));
        });

        var tagnames = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: '/api/tags/names',
                filter: function (list) {
                    return $.map(list, function (tagname) {
                        return { name: tagname };
                    });
                }
            }
        });

        tagnames.initialize();
        $('#Tags').tagsinput({
            typeaheadjs: {
                name: 'tagnames',
                displayKey: 'name',
                valueKey: 'name',
                source: tagnames.ttAdapter()
            },
            trimValue: true
        });

        $('#btn-preview').click(function (e) {
            if ($('form').valid()) {
                submitForm(e);
                isPreviewRequired = true;
            }
        });

        $('#btn-save').click(function (e) {
            submitForm(e);
        });

        $('#btn-publish').click(function (e) {
            if ($('form').valid()) {
                $('input[name="IsPublished"]').val('True');
                submitForm(e);
            }
        });

        function submitForm(e) {
            if (window.tinyMCE) {
                window.tinyMCE.triggerSave();
            }

            var selectCatCount = 0;
            $('input[name="SelectedCategoryIds"]').each(function () {
                if ($(this).prop('checked') === true) {
                    ++selectCatCount;
                }
            });

            if ($('.post-edit-form').valid() && selectCatCount === 0) {
                e.preventDefault();
                window.toastr.error('Please select at least one category');
            }
            else {
                if ($('input[name="IsPublished"]').val() === 'True') {
                    $('#btn-publish').hide();
                    $('#btn-preview').hide();
                }
            }
        }

        $('.post-edit-form').areYouSure({
            message: 'You have unsaved changes, are you sure to leave this page?'
        });

        $('#Title').focus();
    },
    keepAlive: function () {
        var tid = setInterval(postNonce, 60 * 1000);
        function postNonce() {
            var num = Math.random();
            $.post('/admin/keep-alive', { nonce: num }, function (data) {
                console.info(data);
            });
        }
        function abortTimer() {
            clearInterval(tid);
        }
    }
};

var btnSubmitPost = '#btn-save';
var onPostCreateEditBegin = function () {
    $(btnSubmitPost).text('Saving...');
    $(btnSubmitPost).addClass('disabled');
    $(btnSubmitPost).attr('disabled', 'disabled');
};

var onPostCreateEditComplete = function () {
    $(btnSubmitPost).text('Save');
    $(btnSubmitPost).removeClass('disabled');
    $(btnSubmitPost).removeAttr('disabled');
};

var onPostCreateEditSuccess = function (data) {
    if (data.postId) {
        $('input[name="PostId"]').val(data.postId);
        toastr.success('Post saved successfully.');

        if (isPreviewRequired) {
            isPreviewRequired = false;
            window.open(`/post/preview/${data.postId}`);
        }
    }
};

var onPostCreateEditFailed = function (context) {
    var message = buildErrorMessage(context);
    if (window.toastr) {
        window.toastr.error(message);
    } else {
        alert(`Error: ${message}`);
    }
};

var btnSubmitPage = '#btn-submit';
var onPageCreateEditBegin = function () {
    $(btnSubmitPage).text('Saving...');
    $(btnSubmitPage).addClass('disabled');
    $(btnSubmitPage).attr('disabled', 'disabled');
};

var onPageCreateEditComplete = function () {
    $(btnSubmitPage).text('Save');
    $(btnSubmitPage).removeClass('disabled');
    $(btnSubmitPage).removeAttr('disabled');
};

var onPageCreateEditSuccess = function (data) {
    if (data.pageId) {
        $('input[name="Id"]').val(data.pageId);
        toastr.success('Page saved successfully.');

        if ($('input[name="IsPublished"]:checked').val() === 'true') {
            $('#btn-preview').hide();
        }

        if (isPreviewRequired) {
            isPreviewRequired = false;
            window.open(`/admin/page/preview/${data.pageId}`);
        }
    }
};

var onPageCreateEditFailed = function (context) {
    var message = buildErrorMessage(context);

    if (window.toastr) {
        window.toastr.error(message);
    } else {
        alert(`Error: ${message}`);
    }
};

function deletePost(postid) {
    $(`#span-processing-${postid}`).show();
    callApi(`/post/manage/${postid}/destroy`, 'DELETE', {},
        (resp) => {
            $(`#tr-${postid}`).hide();
            toastr.success('Post deleted');
        });
}

function restorePost(postid) {
    $(`#span-processing-${postid}`).show();
    callApi(`/post/manage/${postid}/restore`, 'POST', {},
        (resp) => {
            $(`#tr-${postid}`).hide();
            toastr.success('Post restored');
        });
}

function deleteFriendLink(friendlinkid) {
    $(`#span-processing-${friendlinkid}`).show();

    callApi(`/api/friendlink/${friendlinkid}`, 'DELETE', {},
        (resp) => {
            $(`#tr-${friendlinkid}`).hide();
        });
}

function deleteMenu(menuid) {
    $(`#span-processing-${menuid}`).show();

    callApi(`/api/menu/${menuid}`, 'DELETE', {},
        (resp) => {
            $(`#tr-${menuid}`).hide();
        });
}

function initCreateFriendLink() {
    $('#FriendLinkEditViewModel_Id').val(emptyGuid);
    $('#edit-form')[0].reset();
    $('#editFriendlinkModal').modal();
}

function editFriendLink(id) {
    $.get(`/api/friendlink/${id}`, function (data) {
        $('#FriendLinkEditViewModel_Id').val(data.id);
        $('#FriendLinkEditViewModel_Title').val(data.title);
        $('#FriendLinkEditViewModel_LinkUrl').val(data.linkUrl);
        $('#editFriendlinkModal').modal();
    });
}

function deleteAccount(accountid) {
    $(`#span-processing-${accountid}`).show();

    callApi(`/api/localaccount/${accountid}`, 'DELETE', {},
        (resp) => {
            $(`#tr-${accountid}`).hide();
        });
}

function deleteSelectedComments() {
    var cids = [];
    $('.chk-cid:checked').each(function () {
        cids.push($(this).data('cid'));
    });

    callApi('/api/comment/delete', 'DELETE', cids,
        (success) => {
            $.each(cids, function (index, value) {
                $(`#panel-comment-${value}`).slideUp();
            });
        });
}

function initCreateTag() {
    $('#edit-form')[0].reset();
    $('#editTagModal').modal();
}

function initCreateCategory() {
    $('#CategoryEditViewModel_Id').val(emptyGuid);
    $('#edit-form')[0].reset();
    $('#editCatModal').modal();
}

function editCat(id) {
    callApi(`/api/category/edit/${id}`, 'GET', {},
        async (resp) => {
            var data = await resp.json();
            $('#CategoryEditViewModel_Id').val(data.id);
            $('#CategoryEditViewModel_RouteName').val(data.routeName);
            $('#CategoryEditViewModel_DisplayName').val(data.displayName);
            $('#CategoryEditViewModel_Note').val(data.note);
            $('#editCatModal').modal();
        });
}

function deleteCat(catid) {
    $(`#span-processing-${catid}`).show();

    callApi(`/api/category/delete/${catid}`, 'DELETE', {},
        (resp) => {
            $(`#card-${catid}`).hide();
            toastr.success('Category deleted');
        });
}

function initCreateMenu() {
    $('#MenuEditViewModel_Id').val(emptyGuid);
    $('#edit-form')[0].reset();
    $('#editMenuModal').modal();
}

function editMenu(id) {
    callApi(`/api/menu/edit/${id}`, 'GET', {},
        async (resp) => {
            var data = await resp.json();
            $('#MenuEditViewModel_Id').val(data.id);
            $('#MenuEditViewModel_Title').val(data.title);
            $('#MenuEditViewModel_Url').val(data.url);
            $('#MenuEditViewModel_Icon').val(data.icon);
            $('#MenuEditViewModel_DisplayOrder').val(data.displayOrder);
            if (data.isOpenInNewTab) {
                $('#MenuEditViewModel_IsOpenInNewTab').prop('checked', 'checked');
            }
            $('#editMenuModal').modal();
        });
}

function deletePage(pageid, slug) {
    $(`#span-processing-${pageid}`).show();

    callApi(`/api/page/${pageid}/${slug}`,
        'DELETE',
        {},
        (resp) => {
            $(`#card-${pageid}`).hide();
            toastr.success('Page deleted');
        });
}

function deletePingback(pingbackId) {
    $(`#span-processing-${pingbackId}`).show();

    callApi(`/pingback/${pingbackId}`, 'DELETE', {},
        (resp) => {
            $(`#pingback-box-${pingbackId}`).slideUp();
        });
}
var sendTestEmail = function () {
    $('#a-send-test-mail').text('Sending...');
    $('#a-send-test-mail').addClass('disabled');
    $('#a-send-test-mail').attr('disabled', 'disabled');

    $.post('/admin/settings/send-test-email',
        function (data) {
            if (data.isSuccess) {
                window.toastr.success('Email is sent.');
            } else {
                window.toastr.error(data.message);
            }
        })
        .fail(function (xhr, status, error) {
            var responseJson = $.parseJSON(xhr.responseText);
            window.toastr.error(responseJson.message);
        })
        .always(function () {
            $('#a-send-test-mail').text('Send Test Email');
            $('#a-send-test-mail').removeClass('disabled');
            $('#a-send-test-mail').removeAttr('disabled');
        });
};

var btnSaveSettings = '#btn-save-settings';
var onUpdateSettingsBegin = function () {
    $(btnSaveSettings).text('Processing...');
    $(btnSaveSettings).addClass('disabled');
    $(btnSaveSettings).attr('disabled', 'disabled');
};

var onUpdateSettingsComplete = function () {
    $(btnSaveSettings).text('Save');
    $(btnSaveSettings).removeClass('disabled');
    $(btnSaveSettings).removeAttr('disabled');
};

var onUpdateSettingsSuccess = function (context) {
    if (window.toastr) {
        window.toastr.success('Settings Updated');
    } else {
        alert('Settings Updated');
    }
};

var onUpdateSettingsFailed = function (context) {
    var message = buildErrorMessage(context);

    if (window.toastr) {
        window.toastr.error(message);
    } else {
        alert(message);
    }
};

var btnClearCache = '.btn-clearcache';
var onClearCacheBegin = function () {
    $(btnClearCache).text('Processing...');
    $(btnClearCache).addClass('disabled');
    $(btnClearCache).attr('disabled', 'disabled');
};

var onClearCacheComplete = function () {
    $(btnClearCache).text('Clear');
    $(btnClearCache).removeClass('disabled');
    $(btnClearCache).removeAttr('disabled');
};

var onClearCacheSuccess = function (context) {
    $('#cacheModal').modal('hide');
    if (window.toastr) {
        window.toastr.success('Cleared Cache');
    } else {
        alert('Cleared Cache');
    }
};

var onClearCacheFailed = function (context) {
    var msg = buildErrorMessage(context);
    if (window.toastr) {
        window.toastr.error(`Server Error: ${msg}`);
    } else {
        alert(`Error Code: ${msg}`);
    }
};

function tryRestartWebsite() {
    callApi(`shutdown`, 'POST', {}, () => { });
    $('.btn-restart').text('Wait...');
    $('.btn-restart').addClass('disabled');
    $('.btn-restart').attr('disabled', 'disabled');
    startTimer(30, $('.btn-restart'));
    setTimeout(function () {
        location.href = '/admin/settings';
    }, 30000);
}

function tryResetWebsite() {
    callApi(`reset`, 'POST', {}, () => { });
    $('.btn-reset').text('Wait...');
    $('.btn-reset').addClass('disabled');
    $('.btn-reset').attr('disabled', 'disabled');
    startTimer(30, $('.btn-reset'));
    setTimeout(function () {
        location.href = '/';
    }, 30000);
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        display.text(minutes + ':' + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}