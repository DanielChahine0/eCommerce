package com.example.service;

import com.example.dto.RegisterRequest;
import com.example.dto.UserDTO;
import com.example.exception.DuplicateResourceException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Address;
import com.example.model.Role;
import com.example.model.User;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    public UserDTO registerUser(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "User already exists with email: '" + request.getEmail() + "'");
        }

        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException(
                    "User already exists with username: '" + request.getUsername() + "'");
        }

        // Fetch role
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role not found with id: '" + request.getRoleId() + "'"));

        // Create address if provided
        Address address = null;
        if (request.getAddress() != null) {
            address = new Address(
                    request.getAddress().getZip(),
                    request.getAddress().getCountry(),
                    request.getAddress().getStreet(),
                    request.getAddress().getProvince());
        }

        // Create user with encoded password
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getPhoneNumber(),
                address);

        User savedUser = userRepository.save(user);
        return userService.convertToDTO(savedUser);
    }

    public UserDTO getUserByEmail(String email) {
        return userService.getUserByEmail(email);
    }
}
