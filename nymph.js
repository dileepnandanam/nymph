var Nymph = function(parent, name, data) {
  this.name = name
  this.data = data
  this.parent = parent
  this.trace_back = function() {
    if(parent.trace_back)
      return parent.trace_back() + '_' + name
    else
      return this.name
  }
  this.generate_pointer = function() {
    return this.trace_back(this.name)
  }
  this.pointer = this.generate_pointer()
  this.node = function() {
    return(data.constructor != Object && data.constructor != Array)
  }

  this.infect = function() {
    var nymph_obj = this
    if(this.data && this.data.constructor == Array) {
      nymph_obj.children = []
      $.each(this.data, function(i, data) {
        nymph_obj.children.push(new Nymph(nymph_obj, i, data))
        nymph_obj.children[i].infect()
      })
    }
    else if(this.data && this.data.constructor == Object) {
      nymph_obj.children = {}
      $.each(this.data, function(key, data) {
        nymph_obj.children[key] = new Nymph(nymph_obj, key, data)
        nymph_obj.children[key].infect()
      })
    }
  }
  this.infect()

  this.render = function(partial) {
    env = this
    htm = $(partial).html()
    $(partial).html(
      $(partial).html().replace(/\{\{(.*)\}\}/g, function($1,$2){
        return '<span id="' + env.trace_back() + '_' + $2 + '">' + env.eval_attr_access($2).data + '</span>' 
      })
    )
    var new_env = env
    $.each($(partial).find('[partial]'), function(i, partial) {
      var collection = $(partial).attr('collection')
      var model = $(partial).attr('model')
      if(model) {
        var model = $(partial).attr('model')
        var nested_env = new_env.eval_attr_access(model)
        var nested_partial = window.nymph_partials[$(partial).attr('partial')]
        $(partial).attr('id', env.trace_back() + '_' + model)
        $(partial).html(nested_partial)
        nested_env.render($(partial))
      }
      else if(collection) {
        var collection = $(partial).attr('collection')
        var nested_env = new_env.eval_attr_access(collection)
        var nested_partial = window.nymph_partials[$(partial).attr('partial')]
        $(partial).attr('id', env.trace_back() + '_' + collection)
        $.each(nested_env.children, function(i, model) {
          $(partial).append(nested_partial)
          nested_env.children[i].render($(partial).children()[$(partial).children().length -1])
        })
      }
    })
  }

  this.update = function(scope, path, data) {
    s_obj = window.dataset[scope].eval_attr_access(path)
    if(s_obj.data != data) {
      s_obj.data = data
      s_obj.children = null
      s_obj.infect()
      partial = $('#' + s_obj.trace_back())
      $(partial).html('')
      render($(partial).parent(), s_obj.parent)
    }
  }

  this.eval_attr_access = function(chain) {
    chain = chain || ''
    chain = chain.split('.')
    var data = this
    $.each(chain, function(i, attr) {
      if(attr.indexOf('[') > -1) {
        array_element_fetcher = attr.match(/(.*)\[(.*)\]/)
        accessor = array_element_fetcher[1]
        array_index = parseInt(array_element_fetcher[2])
        data = data.children[accessor].children[array_index]
      }
      else {
        if(data.children[attr])
          data = data.children[attr]
        else
          data = Missing(env, attr)
      }
    })
    return data
  }
}

var eval_attr_access = function(env, chain) {
  chain = chain || ''
  chain = chain.split('.')
  var data = env
  $.each(chain, function(i, attr) {
    if(attr.indexOf('[') > -1) {
      array_element_fetcher = attr.match(/(.*)\[(.*)\]/)
      accessor = array_element_fetcher[1]
      array_index = parseInt(array_element_fetcher[2])
      data = data.children[accessor].children[array_index]
    }
    else {
      if(data.children[attr])
        data = data.children[attr]
      else
        data = Missing(env, attr)
    }
  })
  return data
}

var Missing = function(env, attr){
  return {data: 'Nymph::MissingAttribute(' + env.trace_back() + '_' + attr + ')'}
}
window.dataset = window.dataset || {}
$.fn.extend({
  render: function(data, scope) {
    
    if($(this).find('[type="partial"]').length > 0) {
      window.dataset[scope] = new Nymph({}, scope, data)
      window.dataset[scope].render($(this), window.dataset[scope])
      return window.dataset[scope]
    } 
    else {
      console.log('Selected element doesn\'t contain any partials')
      console.log('available partials under your selection are. try ..')
      $.each($(document).find('*'), function(i, e) {
        if($(e).attr('class') && $(e).attr('partial'))
          console.log('$(\'.' + $(e).attr('class').split(' ').join('.') +'\').render(response_data, \'' + scope + '\')')
      })
      return false
    }
  }

})

$(document).ready(function(){$('body').render(response, 'root') })

