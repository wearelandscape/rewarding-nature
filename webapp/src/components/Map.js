import React from 'react'
import * as d3 from 'd3'
import * as L from 'leaflet'
import * as $ from 'jquery'
import _ from 'lodash'

class Map extends React.Component {
  state = {}

  componentDidMount() {
    // load data
    this.update()
  }

  update() {
    var fieldid,
      activeFeature,
      map = {},
      activeBounds,
      bbox,
      offset = 0,
      busy = false,
      farmcontrol,
      farm = null,
      filecontrol
    var fieldsLayer, fieldLayer, farmLayer
    var baseUrl = 'https://agrodatacube.wur.nl/api/v1/rest'
    var startView = [52.52, 4.815],
      startZoom = 14
    function mousePropagationKiller(div, map) {
      if (!L.Browser.touch) {
        L.DomEvent.disableClickPropagation(div)
        L.DomEvent.disableScrollPropagation(div)
        L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation)
      } else {
        L.DomEvent.on(div, 'click dblclick', function(ev) {
          if (ev.type == 'div') {
            L.DomEvent.stopPropagation(ev)
            L.DomEvent.stop(ev)
          }
        })
        div.addEventListener('mouseover', function() {
          map.dragging.disable()
          map.doubleClickZoom.disable()
        })
        div.addEventListener('mouseout', function() {
          map.dragging.enable()
          map.doubleClickZoom.enable()
        })
      }
    }
    function getProperty(propertyName, object) {
      var parts = propertyName.split('.'),
        length = parts.length,
        i,
        property = object || this

      for (i = 0; i < length; i++) {
        property = property[parts[i]]
      }

      return property
    }
    function createSelect(
      parentcomponent,
      onChange,
      label,
      choices,
      field,
      styleFn
    ) {
      var selectdiv = L.DomUtil.create('div', '', parentcomponent)
      var vraagdiv = L.DomUtil.create('div', '', selectdiv)
      vraagdiv.innerHTML = '<b> &nbsp;' + label + ':</b>'
      var selectcomp = L.DomUtil.create('select', '', selectdiv)

      var title,
        options =
          '<option value="" disabled selected style="display:none;">(make a choice)</option>'

      for (var j = 0; j < choices.length; j++) {
        if (field) title = getProperty(field, choices[j])
        else title = choices[j]
        options +=
          '<option class="' +
          styleFn(choices[j]) +
          '" value="' +
          j +
          '">' +
          title +
          '</option>'
      }
      selectcomp.innerHTML = options
      selectcomp['data'] = choices
      selectcomp['function'] = onChange
      selectcomp.onchange = function(e) {
        console.log(this['data'][parseInt(this.value)])
        if (selectcomp['function'])
          selectcomp['function'](this['data'][parseInt(this.value)])
      }

      return selectdiv
    }
    var enumKruidenrijkheid = { E: 'niet', D: 'niet', C: 'bijna', B: 'wel' }
    var enumColor = { E: 'red', D: 'red', C: 'orange', B: 'green' }
    function kruidenrijkheidStyle(feature) {
      return {
        color:
          enumColor[(feature.properties.classificatie || 'A').split(' ')[0]] ||
          'pink'
      }
    }
    function kruidenrijkheidDoelstellingStyle(object) {
      return object['kruidenrijkheid']['wel'] >= 0.2 ? 'green' : 'black'
    }
    function selectFeature(e) {
      var aLayer = e.target
      var options = aLayer.options || aLayer._options
      if (options.title == 'fields') {
        activeFeature = aLayer.feature
        fieldid = activeFeature.properties['fieldid']

        $.ajax({
          type: 'GET',
          url:
            baseUrl +
            '/fields/' +
            fieldid +
            '?output_epsg=4326&page_size=50&page_offset=0',
          dataType: 'json',
          crossDomain: true,
          headers: {
            'Content-Type': 'text/plain'
          },
          error: function(xhr, textStatus, errorThrown) {
            alert(
              textStatus + ' (' + errorThrown + '): ' + xhr.responseText || ''
            )
          },
          success: function(response) {
            if (fieldLayer) {
              fieldLayer.clearLayers()
              controlLayers['fields'].removeLayer(fieldLayer)
            }
            fieldLayer = L.geoJson(response, {
              title: 'fields',
              style: { color: 'blue' },
              onEachFeature: onEachFeature
            }).addTo(map['fields'])
            controlLayers['fields'].addOverlay(fieldLayer, 'Field ' + fieldid)
            var bounds = fieldLayer.getBounds()
            map['fields'].fitBounds(bounds, { padding: [1, 1] })
          }
        })
      }
    }
    function zoomToFeature(e) {
      var bounds = e.target.getBounds()
      map['fields'].fitBounds(bounds, { padding: [0.1, 0.1] })
    }
    function onEachFeature(aFeature, aLayer) {
      var options = aLayer.options || aLayer._options

      aLayer.on({
        // selectFeature//,
        click:
          // dblclick:
          zoomToFeature
      })
      var props = '<b>' + options.title + '</b><br>'
      for (const d in aFeature.properties) {
        // if (aFeature.properties[d] != null)
        props += '<br>' + d + ': ' + aFeature.properties[d]
      }
      aFeature.properties.type = options.title
      aLayer.bindTooltip(props, { direction: 'center', className: 'label' })
    }
    function nextFieldsPage() {
      offset += 50
      var url =
        baseUrl +
        '/fields?output_epsg=4326&page_size=50&page_offset=' +
        offset +
        '&year=2017&geometry=POLYGON((' +
        bbox[0] +
        '%20' +
        bbox[1] +
        ',' +
        bbox[0] +
        '%20' +
        bbox[3] +
        ',' +
        bbox[2] +
        '%20' +
        bbox[3] +
        ',' +
        bbox[2] +
        '%20' +
        bbox[1] +
        ',' +
        bbox[0] +
        '%20' +
        bbox[1] +
        '))&epsg=4326'
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        crossDomain: true,
        headers: {
          'Content-Type': 'text/plain'
        },
        success: function(response, textStatus) {
          if (fieldsLayer) fieldsLayer.addData(response)
          if (fieldLayer) fieldLayer.bringToFront()
          if (response.features.length < 50) busy = false
          else nextFieldsPage()
        },
        error: function(xhr, textStatus, errorThrown) {
          alert(
            textStatus + ' (' + errorThrown + '): ' + xhr.responseText || ''
          )
        }
      })
    }
    function onMoveEnd(e) {
      var bounds = e.target.getBounds()
      bbox = bounds.toBBoxString().split(',')

      if (!busy && (!activeBounds || activeBounds != bounds)) {
        busy = true
        offset = 0

        var url =
          baseUrl +
          '/fields?output_epsg=4326&page_size=50&page_offset=' +
          offset +
          '&year=2017&geometry=POLYGON((' +
          bbox[0] +
          '%20' +
          bbox[1] +
          ',' +
          bbox[0] +
          '%20' +
          bbox[3] +
          ',' +
          bbox[2] +
          '%20' +
          bbox[3] +
          ',' +
          bbox[2] +
          '%20' +
          bbox[1] +
          ',' +
          bbox[0] +
          '%20' +
          bbox[1] +
          '))&epsg=4326'
        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'json',
          crossDomain: true,
          headers: {
            'Content-Type': 'text/plain'
          },
          success: function(response, textStatus) {
            if (fieldsLayer) {
              fieldsLayer.clearLayers()
              controlLayers['fields'].removeLayer(fieldsLayer)
            }
            fieldsLayer = L.geoJson(response, {
              title: 'fields',
              style: { color: 'green' },
              onEachFeature: onEachFeature
            }).addTo(map['fields'])
            controlLayers['fields'].addOverlay(fieldsLayer, 'Fields')
            if (fieldLayer) fieldLayer.bringToFront()
            if (response.features.length < 50) busy = false
            else {
              nextFieldsPage()
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            alert(
              textStatus + ' (' + errorThrown + '): ' + xhr.responseText || ''
            )
          }
        })
        activeBounds = bounds
      }
    }
    map['fields'] = L.map(this.anchor).setView(startView, startZoom)

    var baseLayers = {
      'Open Street Map': L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }
      ),
      'Google Hybrid Map': L.tileLayer(
        'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          attribution:
            'Imagery &copy; DigitalGlobe, Map data &copy; <a href="https://www.google.com/intl/en/help/terms_maps.html" target="_blank">Google</a>',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
      )
    }
    map['fields'].addLayer(baseLayers['Open Street Map'])
    // map['fields'].on('moveend', onMoveEnd);

    // filecontrol left
    filecontrol = L.control({ position: 'topleft' })
    filecontrol.handleReaderAbort = function(e) {
      alert('File read cancelled')
    }
    filecontrol.handleReaderLoadend = function(ev) {
      // check ready
      if (ev.target.readyState == FileReader.DONE) {
        // DONE == 2
        console.log(ev.target.filename)
        if (ev.target.result) {
          var parts = ev.target.filename.split('.')
          var extensie = parts[parts.length - 1].toLowerCase()
          if (extensie == 'json' || extensie == 'geojson') {
            var geojson = JSON.parse(ev.target.result)
            var keys_data = d3
              .nest()
              .key(function(d) {
                return 'farm ' + d.properties.Nummer % 10
              })
              .entries(geojson.features)
              .sort(function(x, y) {
                return d3.ascending(x.key, y.key)
              })
            // for each farm (identified by DEELN_ID)
            // calculate percentages of kruidenrijkheid
            keys_data.forEach(function(item, index) {
              item['Opp.'] = 0
              item['kruidenrijkheid'] = { niet: 0, bijna: 0, wel: 0 }

              // sum area and NET_AREA for al fields of a farm
              item.values.forEach(function(subitem, subindex) {
                item['Opp.'] += subitem.properties['Opp.']
                item['kruidenrijkheid'][
                  enumKruidenrijkheid[
                    (subitem.properties.classificatie || 'A').split(' ')[0]
                  ] || 'niet'
                ] +=
                  subitem.properties['Opp.']
              })
              if (item['Opp.'] > 0) {
                item['kruidenrijkheid']['niet'] /= item['Opp.']
                item['kruidenrijkheid']['bijna'] /= item['Opp.']
                item['kruidenrijkheid']['wel'] /= item['Opp.']
              }
            })
            if (keys_data.length > 0) {
              createSelect(
                farmcontrol.farms,
                onChangeFarm,
                'Farms',
                keys_data,
                'key',
                kruidenrijkheidDoelstellingStyle
              )
            }
            /* var geojsonLayer = L.geoJson(geojson, {
  						title: parts[parts.length - 2],
  						style: {color: 'pink'},
  						pointToLayer: function(geoJsonPoint, latlng) {
  							return L.circleMarker(latlng, {title: parts[parts.length - 2], weight:1, radius: 2});
  						},
  						onEachFeature: onEachFeature}
  					).addTo(map['fields']);
  					controlLayers['fields'].addOverlay(geojsonLayer, parts[parts.length - 2]);
  					*/
          }
        } else {
          alert('empty file')
        }
      }
    }
    filecontrol.handleFileSelect = function(evt) {
      if (evt.target.files.length > 0) {
        console.log(
          evt.target.files.length,
          evt.target.files[0].name,
          evt.target.files[evt.target.files.length - 1].name
        )
        // checks
        for (var f = evt.target.files.length - 1; f > -1; f--) {
          var file = evt.target.files[f]
          if (file.size == 0) {
            alert('empty file: ' + file.name)
            return
          }
          var fileparts = file.name.split('.')
          var extensie = fileparts[fileparts.length - 1].toLowerCase()
          if (extensie != 'json' && extensie != 'geojson') {
            alert('wrong file type: ' + extensie)
            return
          }
        }

        var reader = []
        for (var f = evt.target.files.length - 1; f > -1; f--) {
          reader.push(new FileReader())
        }
        for (var f = evt.target.files.length - 1; f > -1; f--) {
          // reader.onerror = errorHandler;
          // reader.onprogress = updateProgress; // + reader.onloadstart, reader.onload
          reader[f].onabort = filecontrol.handleReaderAbort
          reader[f].onloadend = filecontrol.handleReaderLoadend
          reader[f]['filename'] = evt.target.files[f].name
          var file = evt.target.files[f]
          var fileparts = file.name.split('.')
          var extensie = fileparts[fileparts.length - 1].toLowerCase()
          if (extensie == 'json' || extensie == 'geojson')
            reader[f].readAsText(file)
        }
        evt.target.value = ''
        // bug recurrent filebox in edge
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8282613/
        // opgelost in: Microsoft EdgeHTML 15.15xxx
      }
    }
    filecontrol.onAdd = function(map) {
      this._div = L.DomUtil.create('div', 'filecontrol')
      mousePropagationKiller(this._div, map)
      this._lbl = L.DomUtil.create('label', 'fileContainer', this._div)
      this._lbl.textContent = '+ file geojson'
      this._files = L.DomUtil.create('input', 'files', this._lbl)
      this._files.setAttribute('type', 'file')
      this._files.setAttribute('accept', '.json,.geojson')
      return this._div
    }
    filecontrol.addTo(map['fields'])
    filecontrol._files.addEventListener('change', filecontrol.handleFileSelect)

    // farmcontrol left
    function onChangeFarm(object) {
      farm = object.key
      if (farmLayer) {
        farmLayer.clearLayers()
        // controlLayers['fields'].removeLayer(farmLayer);
      }
      farmLayer = L.geoJson(
        { type: 'FeatureCollection', features: object.values },
        {
          title: farm,
          style: kruidenrijkheidStyle,
          onEachFeature: onEachFeature
        }
      ).addTo(map['fields'])
      // controlLayers['fields'].addOverlay(farmLayer, farm);
      map['fields'].flyToBounds(farmLayer.getBounds(), { padding: [0.5, 0.5] })
    }
    farmcontrol = L.control({ position: 'topleft' })
    farmcontrol.onAdd = function(map) {
      this._div = L.DomUtil.create('div', 'farmcontrol')
      mousePropagationKiller(this._div, map)
      this.farms = L.DomUtil.create('div', 'infotools', this._div)
      return this._div
    }
    farmcontrol.addTo(map['fields'])

    var controlLayers = {}
    controlLayers['fields'] = L.control.layers(baseLayers).addTo(map['fields'])
    controlLayers['fields'].setPosition('topleft')

    // onMoveEnd({target: map['fields']});
  }

  render() {
    const { data } = this.props

    if (data == null) {
      return null
    }

    return (
      <div
        style={{ height: '100%', width: '100%' }}
        ref={node => (this.anchor = node)}
      />
    )
  }
}

export default Map
