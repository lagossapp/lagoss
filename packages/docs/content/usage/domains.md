# Domains

By default, all Functions are assigned a unique URL, which is a subdomain of `lagoss.com`, pointing to the current production Deployment. The subdomain is always the name of the Function: if your Function is named `my-function`, your unique URL will be `my-function.lagoss.com`.

All domains (default and custom) are automatically assigned an SSL certificate, provided by [Let's Encrypt](https://letsencrypt.org/). They are also automatically renewed before they expire. As such, the first request to a Function using a brand-new custom domain may take a few seconds to generate the SSL certificate.

All requests to your Function are automatically redirected to HTTPS.

## Adding a domain

You can add custom domains or subdomains to your Functions, pointing to the current production Deployment. Head over to the settings tab of your Function, and scroll to the "Domains" section. Here, you can see a list including both the default domain and any custom domains or subdomains you've added:

![Domains](/images/domains-list.png)

To add a new custom domain or subdomain, click on "Add domain" button at the right, fill in the domain or subdomain and validate. Next, follow the instructions below to [point your domain or subdomain to Lagoss](#pointing-your-domain-to-lagoss).

## Pointing your domain to Lagoss

Now that you've added a custom domain or subdomain, you must update the DNS settings of your domain to point to Lagoss. You can do this by adding a CNAME record, pointing to your Function's default domain.

### For a domain

::: warning
Apex domains (root domains) are not supported. You can redirect your apex domain to a `www` subdomain, and then point the `www` subdomain to Lagoss.
:::

Let's say that you have the following:

- A domain `www.domain.com`
- A Function named `awesome-function` (which has the default subdomain `awesome-function.lagoss.com`)

You should now add a new CNAME record named `www`, pointing to `awesome-function.lagoss.com`. After adding this record, go back to the settings tab of your Function, and you should now see your custom domain validated:

![Custom domains](/images/www-domains-list.png)

### For a subdomain

Let's say that you have the following:

- A subdomain `my.domain.com`
- A Function named `awesome-function` (which has the default subdomain `awesome-function.lagoss.com`)

You should now add a new CNAME record named `my`, pointing to `awesome-function.lagoss.com`. After adding this record, go back to the settings tab of your Function, and you should now see your custom subdomain validated:

![Custom domains](/images/my-domains-list.png)

## Removing a domain

To remove a custom domain or subdomain, click on the "Delete" button next to the domain name. You cannot remove the default subdomain.
