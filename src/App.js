import React, { Component } from 'react';

import axios from 'axios';
import './App.css';

const Filter = ({ change }) => {
    return (<input type="text" onChange={change} placeholder="Search Locations" />);
};

const Venue = ({ venue, click }) => {
    return (<li><button id={venue.venue.id} key={venue.venue.id} type="button" onClick={click}>{venue.venue.name}</button></li>);
};

const Venues = ({ venues, click }) => {

    const venueNode = venues.map((venue) => {
        return (<Venue key={venue.venue.id} venue={venue} click={click} />)
    });

    return (<ul>{venueNode}</ul>);
};

class App extends Component {

    state = {
        map: null,
        infoWinfow: null,
        venues: [],
        filteredVenues: []
    }

    componentDidMount() {
        this.getVenues()

    }

    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAivG5UOGStDECEXzAiolpN_91ePVL3mE4&callback=initMap")
        window.initMap = this.initMap
        
    }

    getVenues = () => {

        const endPoint = "https://api.foursquare.com/v2/venues/explore?",
            parameters = {
                client_id: "B1JDVT55UR5DEOP3XTVYBBYIHOPZUA3L0VPHYMPSOW4LDTHM",
                client_secret: "5PVPA25PYYLPLAHIM0I4YQJVPDRKBJYVMMG4SAYCFHJIYC21",
                query: "food",
                near: "Sydney",
                v: "20180323"
            };

        axios
            .get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState({
                    venues: response.data.response.groups[0].items,
                    filteredVenues: response.data.response.groups[0].items
                }, this.renderMap())
                //console.log(response.data.response.groups[0].items)
            })
            .catch(error => {
                console.log("Error!!" + error)
            });

    }


    // Create a map
    initMap = () => {

        this.setState({
            map: new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            }),
            infowindow: new window.google.maps.InfoWindow({})
        });

        //Display dynamic markers
        this.state.venues.map(myVenue => {

            var contentString = `${myVenue.venue.name}`;

            // Create a Marker
            var marker = new window.google.maps.Marker({
                position: {
                    lat: myVenue.venue.location.lat,
                    lng: myVenue.venue.location.lng
                },
                map: this.state.map,
                title: myVenue.venue.name
            });

            //Click on a marker!
            marker.addListener('click', () => {

                //Change the content
                this.state.infowindow.setContent(contentString);

                //Open an info window
                this.state.infowindow.open(this.state.map, marker);
            });

            myVenue.marker = marker;

        });

    }

    onFilter = (e) => {
        this.setState({
            filteredVenues: this.state.venues.filter((venue) => {
                return venue.venue.name.toLowerCase().includes(e.target.value.toLowerCase());
            })
        })
    }


    onClick = (e) => {

        let clickedVenue = this.state.venues.filter((venue) => {
            return venue.venue.id == e.target.id;
        })[0];

        this.state.infowindow.setContent(`${clickedVenue.venue.name}`);
        this.state.infowindow.open(this.state.map, clickedVenue.marker);
    }

    render() {
        return (
            <main>
                <div id="sidebar">
                    <Filter change={this.onFilter} />
                    <Venues venues={this.state.filteredVenues} click={this.onClick} />
                </div>
                <div id="map"></div>
            </main>
        );
    }

}


/*

<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    async defer></script>

    */

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0]
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default App;
