# Contributing Guidelines

## 🎯 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Ask questions if unclear
- Help new contributors

---

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

---

## 📋 Commit Message Format

```
type(scope): subject

feat(auth): add JWT token refresh
fix(cart): resolve quantity calculation bug
docs(api): update endpoints documentation
style(navbar): improve responsive design
refactor(redux): simplify state structure
test(user): add profile update tests
chore(deps): update dependencies
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Test additions
- `chore` - Maintenance

---

## ✅ Before Submitting PR

### Backend
- [ ] Code follows project style
- [ ] Tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] No console errors/warnings
- [ ] Database migrations included
- [ ] Environment variables documented

### Frontend
- [ ] Code follows project style
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors/warnings
- [ ] Responsive design verified
- [ ] Accessibility checked

---

## 📝 PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #issue_number

## Testing
How to test these changes

## Screenshots (if applicable)
Before/After images

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex logic
- [ ] I have updated documentation
- [ ] Tests pass locally
```

---

## 🎨 Code Style

### Backend (Node.js)
```javascript
// Use consistent indentation (2 spaces)
// Use meaningful variable names
// Add comments for complex logic
// Follow REST conventions

// ✓ Good
const getUserProfile = async (userId) => {
  try {
    const user = await User.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
};

// ✗ Avoid
const getUser = async (id) => {
  return await User.findUnique({ where: { id } });
};
```

### Frontend (React)
```javascript
// Use functional components
// Use React hooks
// Use descriptive component names
// Keep components small and focused

// ✓ Good
const UserProfile = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  return <div>{user?.name}</div>;
};

// ✗ Avoid
const UP = () => {
  // component logic
};
```

---

## 🧪 Testing Requirements

### Backend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📚 Documentation

### Update these files when making changes:
- `README.md` - Major feature changes
- `docs/API_DOCUMENTATION.md` - New API endpoints
- `docs/ARCHITECTURE.md` - Architecture changes
- `CHANGELOG.md` - All changes
- Code comments - Complex logic

---

## 🔍 Review Process

1. **Automated Checks**
   - CI/CD tests pass
   - Linting passes
   - Code coverage maintained

2. **Code Review**
   - Design review
   - Logic verification
   - Performance consideration
   - Security review

3. **Approval**
   - At least 2 approvals required
   - No requested changes
   - Ready to merge

---

## 🐛 Reporting Bugs

### Include
- [ ] Bug description
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Screenshots/videos
- [ ] Environment details
- [ ] Browser/Node version

### Example
```markdown
## Bug Report

### Description
When adding product to cart, quantity shows 0

### Steps to Reproduce
1. Go to product page
2. Click "Add to Cart"
3. Check cart items

### Expected
Quantity should be 1

### Actual
Quantity shows 0

### Environment
- Browser: Chrome 120
- OS: Windows 11
- Node: v18.0.0
```

---

## 💡 Feature Requests

### Include
- [ ] Feature description
- [ ] Use case/motivation
- [ ] Proposed implementation
- [ ] Alternative approaches
- [ ] Potential issues

---

## 🚫 What Not to Do

- ❌ Don't commit to main/master directly
- ❌ Don't commit node_modules
- ❌ Don't expose secrets in code
- ❌ Don't make unnecessary changes
- ❌ Don't ignore linting/tests
- ❌ Don't use force push
- ❌ Don't update dependencies without testing

---

## 📞 Need Help?

- Check documentation in `/docs`
- Review existing issues/PRs
- Ask in discussions
- Reach out on Slack/Discord

---

## 🎉 Thank You!

Your contributions make this project better. We appreciate your effort and time!
