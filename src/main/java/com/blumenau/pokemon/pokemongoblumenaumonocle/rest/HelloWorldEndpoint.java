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
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Objects;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;


@Path("/hello")
@Stateless
public class HelloWorldEndpoint {
	private String urlServer = "http://158.69.250.59:5555/data";
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
            Response respuesta = gson.fromJson(json, Response.class);

            System.out.println(respuesta.getExample());
            System.out.println(respuesta.getFr());

        } catch (Exception ex) {
			throw ex;
        }
		return Response.ok(response).build();
	}

	public class Response{

        
    }
}