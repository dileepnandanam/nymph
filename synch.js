var Synch = function(parent, name, data) {
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
    var synch_obj = this
    if(this.data && this.data.constructor == Array) {
      synch_obj.children = []
      $.each(this.data, function(i, data) {
        synch_obj.children.push(new Synch(synch_obj, i, data))
        synch_obj.children[i].infect()
      })
    }
    else if(this.data && this.data.constructor == Object) {
      synch_obj.children = {}
      $.each(this.data, function(key, data) {
        synch_obj.children[key] = new Synch(synch_obj, key, data)
        synch_obj.children[key].infect()
      })
    }
  }
}

var Missing = function(env, attr){
  return {data: 'Nymph::MissingAttribute(' + env.trace_back() + '_' + attr + ')'}
}