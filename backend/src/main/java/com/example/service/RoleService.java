package com.example.service;

import com.example.dto.CreateRoleRequest;
import com.example.dto.RoleDTO;
import com.example.exception.DuplicateResourceException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Role;
import com.example.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    public RoleDTO createRole(CreateRoleRequest request) {
        // Check for duplicate role name
        if (roleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                "Role already exists with name: '" + request.getName() + "'");
        }
        
        Role role = new Role(request.getName(), request.getDescription());
        Role savedRole = roleRepository.save(role);
        return convertToDTO(savedRole);
    }
    
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Role not found with id: '" + id + "'"));
        return convertToDTO(role);
    }
    
    public RoleDTO getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Role not found with name: '" + name + "'"));
        return convertToDTO(role);
    }
    
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public RoleDTO updateRole(Long id, CreateRoleRequest request) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Role not found with id: '" + id + "'"));
        
        // Check if name is being changed and if it's already taken
        if (!role.getName().equals(request.getName()) && 
            roleRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                "Role name already in use: '" + request.getName() + "'");
        }
        
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        
        Role updatedRole = roleRepository.save(role);
        return convertToDTO(updatedRole);
    }
    
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Role not found with id: '" + id + "'");
        }
        roleRepository.deleteById(id);
    }
    
    private RoleDTO convertToDTO(Role role) {
        return new RoleDTO(
            role.getId(),
            role.getName(),
            role.getDescription()
        );
    }
}
