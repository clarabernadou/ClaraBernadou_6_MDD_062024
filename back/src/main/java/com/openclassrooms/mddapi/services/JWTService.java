package com.openclassrooms.mddapi.services;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.time.Instant;

/**
 * Service for generating JWT tokens
 * This class provides functionality to create JWT tokens with specified claims and encoding parameters
 */
@Service
public class JWTService {
    private final JwtEncoder jwtEncoder;

    /**
     * Constructs new JWTService with specified JwtEncoder
     *
     * @param jwtEncoder encoder used to encode JWT tokens
     */
    public JWTService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    /**
     * Generates JWT token for given email or username
     * The token is signed with HS256 algorithm and contains standard claims such as issuer, issue date, expiration date, and subject
     *
     * @param emailOrUsername email or username of user for whom token is generated
     * @return generated JWT token as String
     */
    public String generateToken(String emailOrUsername) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.DAYS))
                .subject(emailOrUsername)
                .build();
        JwtEncoderParameters jwtEncoderParameters =
                JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims);
        return this.jwtEncoder.encode(jwtEncoderParameters).getTokenValue();
    }
}
