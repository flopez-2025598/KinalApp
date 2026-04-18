package com.fareslopez.kinalapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KinalRestApplication {

	public static void main(String[] args) {
		SpringApplication.run(KinalRestApplication.class, args);

		System.out.println("\n-------------------------------------------------------");
		System.out.println("  KinalApp lista para usar!");
		System.out.println("  Aquí puedes ver tu página: http://localhost:8021");
		System.out.println("-------------------------------------------------------\n");
	}

}