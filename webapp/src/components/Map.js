import React from 'react'
// import * as d3 from 'd3'
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
    const onSelect = this.props.onSelect.bind(this)
    // vanilla JS goes here
    const { data } = this.props
    if (data == null) return

    var fieldid,
      activeFeature,
      map = {},
      activeBounds,
      bbox,
      offset = 0,
      busy = false,
      filecontrol
    var fieldsLayer, fieldLayer
    var baseUrl = 'https://agrodatacube.wur.nl/api/v1/rest'
    var startView = [52.52, 4.815],
      startZoom = 14
    var enumKruidenrijkheid = {
      '0': 'niet',
      '1': 'niet',
      '2': 'bijna',
      '3': 'bijna',
      '4': 'wel',
      '5': 'wel'
    }

    function mousePropagationKiller(div, map) {
      if (!L.Browser.touch) {
        L.DomEvent.disableClickPropagation(div)
        L.DomEvent.disableScrollPropagation(div)
        L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation)
      } else {
        L.DomEvent.on(div, 'click dblclick', function(ev) {
          if (ev.type === 'div') {
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
    function selectFeature(e) {
      onSelect(_.get(e.target, 'feature'))
      var aLayer = e.target
      var options = aLayer.options || aLayer._options
      if (options.title === 'fields') {
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
          // beforeSend: function( xhr ) {
          //	xhr["token"] = MIJN_TOKEN;
          // },
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
            // map['files'].fitBounds(bounds, {padding: [0.1,0.1]});
          }
        })
      }
    }
    function zoomToFeature(e) {
      var bounds = e.target.getBounds()
      // map['fields'].fitBounds(bounds, {padding: [0.1,0.1]});
      // map['files'].fitBounds(bounds, {padding: [0.1,0.1]});
    }
    function onEachFeature(aFeature, aLayer) {
      var options = aLayer.options || aLayer._options

      aLayer.on({
        click: selectFeature //,
        // dblclick: zoomToFeature
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
        // beforeSend: function( xhr ) {
        //	xhr["token"] = MIJN_TOKEN;
        // },
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
          // beforeSend: function( xhr ) {
          //	xhr.setRequestHeader("token", MIJN_TOKEN);
          // },
          /* xhrFields: {
            withCredentials: true
          },
          */ headers: {
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
    function geocodeSearch(searchStr) {
      var center = map['fields'].getCenter()
      var url =
        'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates' +
        '?SingleLine=' +
        searchStr +
        '&f=json' +
        '&location=' +
        center +
        '&distance=2' + // '3218.69' = 2 meters
        '&outSR=4326' + // '102100'  = web mercator
        // '&searchExtent='+bbox+
        // '&outFields=Loc_name'+
        '&maxLocations=1'
      /* PDOK locatieserver => json.response.docs[0].centroide_ll
  https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?q=langbroek&rows=1
  {"response":{"numFound":1167,"start":0,"maxScore":26.717785,"docs":
  [
  {"bron":"BAG","identificatie":"1303","provinciecode":"PV26","woonplaatscode":"1303","type":"woonplaats","woonplaatsnaam":"Langbroek","provincienaam":"Utrecht","centroide_ll":"POINT(5.35005208 52.00328214)","gemeentecode":"0352","weergavenaam":"Langbroek, Wijk bij Duurstede, Utrecht","provincieafkorting":"UT","centroide_rd":"POINT(152448.962 446101.503)","id":"wpl-0562d68d3ba1b866e6c787f2cab1ca56","gemeentenaam":"Wijk bij Duurstede","score":26.717785}
  ]}}
  */
      var xhttp
      xhttp = new XMLHttpRequest()

      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText)
          // this.responseXML;
          var searchExt = response.candidates[0].extent
          // var spatialRef= response.spatialReference.wkid;
          var bounds = [
            [searchExt.ymin, searchExt.xmin],
            [searchExt.ymax, searchExt.xmax]
          ]
          map['fields']
            .fitBounds(bounds, { padding: [0, 0] })
            .setZoom(startZoom - 1)
        }
      }
      xhttp.open('GET', url, true)
      xhttp.send()
    }
    if (document.querySelector('#searchForm'))
      document
        .querySelector('#searchForm')
        .addEventListener('submit', function(e) {
          geocodeSearch(e.target.children.namedItem('search').value)
          e.preventDefault()
          return false // prevent page reload
        })

    map['fields'] = L.map(this.anchor).setView(startView, startZoom)
    // map['files'] = L.map('map2',{attributionControl: false, zoomControl: false}).setView(startView, startZoom+1);

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
    map['fields'].on('moveend', onMoveEnd)

    var controlLayers = {}
    controlLayers['fields'] = L.control.layers(baseLayers).addTo(map['fields'])
    controlLayers['fields'].setPosition('topleft')
    // controlLayers['files'] = L.control.layers([]).addTo(map['files']);
    // controlLayers['files'].setPosition('topleft');

    onMoveEnd({ target: map['fields'] })
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
