package com.example.service;

import com.example.dto.AddressDTO;
import com.example.dto.CreateUserRequest;
import com.example.dto.RoleDTO;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(CreateUserRequest request) {
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
            AddressDTO addressDTO = request.getAddress();
            address = new Address(
                    addressDTO.getZip(),
                    addressDTO.getCountry(),
                    addressDTO.getStreet(),
                    addressDTO.getProvince());
        }

        // Create user
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getPhoneNumber(),
                address);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: '" + id + "'"));
        return convertToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: '" + email + "'"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role not found with id: '" + roleId + "'"));
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(Long id, CreateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: '" + id + "'"));

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already in use: '" + request.getEmail() + "'");
        }

        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException(
                    "Username already in use: '" + request.getUsername() + "'");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Update role
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role not found with id: '" + request.getRoleId() + "'"));
        user.setRole(role);

        // Update address if provided
        if (request.getAddress() != null) {
            AddressDTO addressDTO = request.getAddress();
            if (user.getAddress() == null) {
                // Create new address if user doesn't have one
                Address newAddress = new Address(
                        addressDTO.getZip(),
                        addressDTO.getCountry(),
                        addressDTO.getStreet(),
                        addressDTO.getProvince());
                user.setAddress(newAddress);
            } else {
                // Update existing address
                user.getAddress().setZip(addressDTO.getZip());
                user.getAddress().setCountry(addressDTO.getCountry());
                user.getAddress().setStreet(addressDTO.getStreet());
                user.getAddress().setProvince(addressDTO.getProvince());
            }
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "User not found with id: '" + id + "'");
        }
        userRepository.deleteById(id);
    }

    public UserDTO convertToDTO(User user) {
        AddressDTO addressDTO = null;
        if (user.getAddress() != null) {
            addressDTO = new AddressDTO(
                    user.getAddress().getId(),
                    user.getAddress().getZip(),
                    user.getAddress().getCountry(),
                    user.getAddress().getStreet(),
                    user.getAddress().getProvince());
        }

        RoleDTO roleDTO = new RoleDTO(
                user.getRole().getId(),
                user.getRole().getName(),
                user.getRole().getDescription());

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roleDTO,
                user.getPhoneNumber(),
                addressDTO);
    }
}
