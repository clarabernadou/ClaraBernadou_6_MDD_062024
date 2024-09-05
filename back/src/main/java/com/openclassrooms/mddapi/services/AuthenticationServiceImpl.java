package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.services.interfaces.AuthenticationService;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;
import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service implementation for authentication-related operations.
 * This class implements {@link AuthenticationService} interface and provides
 * functionality for user registration and login.
 */
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationRepository authenticationRepository;
    private final ModelMapper modelMapper;
    private final JWTService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ValidationService validationService;

    /**
     * Constructs new AuthenticationServiceImpl with specified dependencies.
     *
     * @param authenticationRepository repository for handling authentication-related operations
     * @param modelMapper model mapper for converting between DTOs and entities
     * @param jwtService service for generating JWT tokens
     * @param passwordEncoder encoder for hashing passwords
     * @param validationService service for validating user data
     */
    public AuthenticationServiceImpl(AuthenticationRepository authenticationRepository, ModelMapper modelMapper, JWTService jwtService, BCryptPasswordEncoder passwordEncoder, ValidationService validationService) {
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.validationService = validationService;
    }

    /**
     * Registers new user based on provided RegisterDTO.
     *
     * @param registerDTO DTO containing user's registration data
     * @return Optional containing JWT token if registration is successful
     * @throws UnauthorizedException if user with same email or username already exists
     */
    @Override
    public Optional<String> registerUser(RegisterDTO registerDTO) {
        validationService.validateRegister(registerDTO);

        Auth auth = modelMapper.map(registerDTO, Auth.class);
        auth.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        if (authenticationRepository.findByEmail(registerDTO.getEmail()).isPresent() ||
            authenticationRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new ConflictException("User already exists!");
        }

        authenticationRepository.save(auth);
        return Optional.of(jwtService.generateToken(registerDTO.getEmail()));
    }

    /**
     * Logs in user based on provided LoginDTO.
     *
     * @param loginDTO DTO containing user's login credentials
     * @return Optional containing JWT token if login is successful
     * @throws UnauthorizedException if credentials are invalid
     */
    @Override
    public Optional<String> loginUser(LoginDTO loginDTO) {
        Optional<Auth> user = authenticationRepository.findByUsername(loginDTO.getEmailOrUsername());
        if (user.isEmpty()) {
            user = authenticationRepository.findByEmail(loginDTO.getEmailOrUsername());
        }

        if (user.isEmpty() || !passwordEncoder.matches(loginDTO.getPassword(), user.get().getPassword())) {
            throw new UnauthorizedException("Invalid credentials!");
        }

        return Optional.of(jwtService.generateToken(loginDTO.getEmailOrUsername()));
    }
}
