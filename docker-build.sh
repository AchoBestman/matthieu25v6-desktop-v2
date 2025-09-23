#!/bin/bash

# Build script for Prophet Kacou Tauri app
# Supports multiple architectures and Linux distributions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  arm64         Build for ARM64 architecture (Apple Silicon, ARM servers)"
    echo "  x86_64        Build for x86_64 architecture (Intel/AMD, Ubuntu 18.04+ compatible)"
    echo "  both          Build for both architectures"
    echo "  clean         Clean up all build artifacts and Docker cache"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 x86_64     # Build only x86_64 version"
    echo "  $0 both       # Build both architectures"
    echo "  $0 clean      # Clean up everything"
}

# Function to create artifact directories
create_directories() {
    print_status "Creating artifact directories..."
    mkdir -p artifacts-arm64
    mkdir -p artifacts-x86_64
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker containers and volumes..."
    
    # Stop and remove containers
    docker compose -f docker-compose.arm64.yml down --volumes --remove-orphans 2>/dev/null || true
    docker compose -f docker-compose.x86_64.yml down --volumes --remove-orphans 2>/dev/null || true
    docker compose -f docker-compose.multi-arch.yml down --volumes --remove-orphans 2>/dev/null || true
    
    # Remove images
    docker rmi matthieu25v6-desktop-v2-prophet-kacou:latest 2>/dev/null || true
    docker rmi matthieu25v6-desktop-v2-prophet-kacou-arm64:latest 2>/dev/null || true
    docker rmi matthieu25v6-desktop-v2-prophet-kacou-x86_64:latest 2>/dev/null || true
    
    # Clean Docker system
    docker system prune -f
    
    # Remove artifact directories
    print_status "Removing artifact directories..."
    rm -rf artifacts-arm64 artifacts-x86_64 artifacts
    
    print_success "Cleanup completed!"
}

# Function to build ARM64
build_arm64() {
    print_status "Building for ARM64 architecture..."
    create_directories
    
    print_status "Starting ARM64 build (this may take several minutes)..."
    docker compose -f docker-compose.arm64.yml up --build
    
    if [ $? -eq 0 ]; then
        print_success "ARM64 build completed!"
        print_status "ARM64 artifacts:"
        find artifacts-arm64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" 2>/dev/null || print_warning "No ARM64 artifacts found"
    else
        print_error "ARM64 build failed!"
        return 1
    fi
}

# Function to build x86_64
build_x86_64() {
    print_status "Building for x86_64 architecture..."
    create_directories
    
    print_status "Starting x86_64 build (this may take several minutes)..."
    docker compose -f docker-compose.x86_64.yml up --build
    
    if [ $? -eq 0 ]; then
        print_success "x86_64 build completed!"
        print_status "x86_64 artifacts:"
        find artifacts-x86_64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" 2>/dev/null || print_warning "No x86_64 artifacts found"
    else
        print_error "x86_64 build failed!"
        return 1
    fi
}

# Function to build both architectures
build_both() {
    print_status "Building for both ARM64 and x86_64 architectures..."
    create_directories
    
    print_status "Starting multi-architecture build (this will take a while)..."
    docker compose -f docker-compose.multi-arch.yml up --build
    
    if [ $? -eq 0 ]; then
        print_success "Multi-architecture build completed!"
        
        print_status "ARM64 artifacts:"
        find artifacts-arm64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" 2>/dev/null || print_warning "No ARM64 artifacts found"
        
        print_status "x86_64 artifacts:"
        find artifacts-x86_64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" 2>/dev/null || print_warning "No x86_64 artifacts found"
    else
        print_error "Multi-architecture build failed!"
        return 1
    fi
}

# Function to show build results
show_results() {
    echo ""
    print_status "=== BUILD RESULTS SUMMARY ==="
    
    if [ -d "artifacts-arm64" ] && [ "$(find artifacts-arm64 -name '*.AppImage' -o -name '*.deb' -o -name '*.rpm' 2>/dev/null | wc -l)" -gt 0 ]; then
        print_success "ARM64 build artifacts:"
        find artifacts-arm64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" -exec ls -lh {} \;
    fi
    
    if [ -d "artifacts-x86_64" ] && [ "$(find artifacts-x86_64 -name '*.AppImage' -o -name '*.deb' -o -name '*.rpm' 2>/dev/null | wc -l)" -gt 0 ]; then
        print_success "x86_64 build artifacts:"
        find artifacts-x86_64 -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" -exec ls -lh {} \;
    fi
    
    echo ""
    print_status "Usage instructions:"
    echo "  • AppImage: Make executable (chmod +x) and run directly"
    echo "  • DEB: Install with 'sudo dpkg -i package.deb' on Debian/Ubuntu"
    echo "  • RPM: Install with 'sudo rpm -i package.rpm' on RedHat/CentOS/Fedora"
}

# Main script logic
case "${1:-help}" in
    "arm64")
        build_arm64
        show_results
        ;;
    "x86_64")
        build_x86_64
        show_results
        ;;
    "both")
        build_both
        show_results
        ;;
    "clean")
        cleanup
        ;;
    "--help"|"help"|"")
        show_usage
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac