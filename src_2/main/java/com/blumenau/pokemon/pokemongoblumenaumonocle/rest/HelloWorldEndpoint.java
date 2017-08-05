package com.blumenau.pokemon.pokemongoblumenaumonocle.rest;


import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import com.blumenau.pokemon.pokemongoblumenaumonocle.rest.HelloWorldEndpoint.GoogleMapsAddress.Results;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;


@Path("/hello")
@Stateless
public class HelloWorldEndpoint {
	private String urlServer = "http://158.69.250.59:5555/data";
    private String urlGoogleMapsAddress = "http://maps.googleapis.com/maps/api/geocode/json";
    // http://maps.googleapis.com/maps/api/geocode/json?latlng=-26.867082,-49.103068&sensor=true get address by lat long
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response doGet(@QueryParam("lastId") String lastId) throws Exception{
		urlServer += "?last_id=" +( Objects.isNull(lastId) ? "0": lastId);
		try (CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {
            HttpGet request = new HttpGet(urlServer);
            request.addHeader("content-type", "application/json");
            HttpResponse result = httpClient.execute(request);
            String json = EntityUtils.toString(result.getEntity(), "UTF-8");

            com.google.gson.Gson gson = new com.google.gson.Gson();
            List<Pokemon> pokemons = gson.fromJson(json, ArrayList.class);
            return Response.ok(pokemons).build();
        } catch (Exception ex) {
			ex.printStackTrace();
            return Response.serverError().build();
        }
        
    }

    private String getAddressFromLatLon(long lat, long lon){
        System.out.println("address");
        urlGoogleMapsAddress += "?latlng=" + lat+','+lon;
		try (CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {
            HttpGet request = new HttpGet(urlGoogleMapsAddress);
            request.addHeader("content-type", "application/json");
            HttpResponse result = httpClient.execute(request);
            String json = EntityUtils.toString(result.getEntity(), "UTF-8");

            com.google.gson.Gson gson = new com.google.gson.Gson();
            GoogleMapsAddress address = gson.fromJson(json, GoogleMapsAddress.class);
            Results rs = address.results.get(0);
            return rs.formatted_address;
        } catch (Exception ex) {
			ex.printStackTrace();
            return "";
        }
    }

    public static class GoogleMapsAddress{
        public List<Results> results;

        public static class Results{
            public String formatted_address;
        }
    }
    
    public static class Pokemon{
        public long expires_at;
        public String id;
        public long lat;
        public long lon;
        public String name;
        public long pokemon_id;
        public boolean trash;
        public long atk;
        public long damage1;
        public long damage2;
        public long def;
        public String move1;
        public String move2;
        public long sta;
        public String address;
    }
}