package com.example.estore.service;

import com.example.estore.dto.*;
import com.example.estore.exception.DuplicateResourceException;
import com.example.estore.exception.ResourceNotFoundException;
import com.example.estore.model.Address;
import com.example.estore.model.User;
import com.example.estore.repository.AddressRepository;
import com.example.estore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, AddressRepository addressRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO createUser(CreateUserRequest request) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Validate username uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Create and save address
        Address address = new Address(
                request.getAddress().getZip(),
                request.getAddress().getCountry(),
                request.getAddress().getStreet(),
                request.getAddress().getProvince());
        address = addressRepository.save(address);

        // Create and save user
        User user = new User(
                request.getUsername(),
                request.getRole(),
                address,
                request.getEmail());
        user = userRepository.save(user);

        return convertToDTO(user);
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(Integer id, CreateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check email uniqueness if changed
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Check username uniqueness if changed
        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Update user fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // Update address
        Address address = user.getAddress();
        address.setZip(request.getAddress().getZip());
        address.setCountry(request.getAddress().getCountry());
        address.setStreet(request.getAddress().getStreet());
        address.setProvince(request.getAddress().getProvince());
        addressRepository.save(address);

        user = userRepository.save(user);
        return convertToDTO(user);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    public User registerUser(RegisterRequest request) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Validate username uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Create and save address
        Address address = new Address(
                request.getAddress().getZip(),
                request.getAddress().getCountry(),
                request.getAddress().getStreet(),
                request.getAddress().getProvince());
        address = addressRepository.save(address);

        // Create and save user with hashed password
        User user = new User(
                request.getUsername(),
                request.getRole(),
                address,
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return user;
    }

    private UserDTO convertToDTO(User user) {
        AddressDTO addressDTO = new AddressDTO(
                user.getAddress().getId(),
                user.getAddress().getZip(),
                user.getAddress().getCountry(),
                user.getAddress().getStreet(),
                user.getAddress().getProvince());

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getEmail(),
                addressDTO);
    }
}
